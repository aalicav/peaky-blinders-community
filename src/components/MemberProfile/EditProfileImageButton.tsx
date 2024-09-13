import React, { useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import * as Yup from 'yup';

const FILE_SIZE = 2 * 1024 * 1024; // Tamanho máximo 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const imageSchema = Yup.object().shape({
  profileImage: Yup.mixed()
    .required("Você precisa selecionar uma imagem")
    .test("fileSize", "O arquivo é muito grande. O tamanho máximo é 2MB", 
      (value: any) => value && value.size <= FILE_SIZE
    )
    .test("fileFormat", "Formato não suportado", 
      (value: any) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
});
interface EditProfileImageButtonProps {
  memberId: string;
  onImageUpdate: (newImageId: string) => void;
}

const EditProfileImageButton: React.FC<EditProfileImageButtonProps> = ({ memberId, onImageUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await imageSchema.validate({ profileImage: file }, { abortEarly: false });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.errors.forEach((err) => {
          toast({
            title: "Erro de validação",
            description: err,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
        return;
      }
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('memberId', memberId);

    try {
      const response = await fetch('/api/members/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha ao atualizar a imagem');

      const { imageId } = await response.json();
      onImageUpdate(imageId);

      toast({
        title: 'Imagem atualizada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar a imagem',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      as="label"
      htmlFor="image-upload"
      leftIcon={<EditIcon />}
      isLoading={isLoading}
      cursor="pointer"
    >
      Editar Imagem
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
    </Button>
  );
};

export default EditProfileImageButton;