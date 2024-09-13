import React, { useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

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