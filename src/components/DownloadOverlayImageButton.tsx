import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Flex } from "@chakra-ui/react";
import { getClassImage } from "../utils/classUtils";
import EditProfileImageButton from "./MemberProfile/EditProfileImageButton";

interface DownloadOverlayImageButtonProps {
  memberName: string;
  memberClass: string;
  profileImageId: string;
  handleImageUpdate: (newImageId: string) => void;
  memberId: string;
}

const DownloadOverlayImageButton: React.FC<DownloadOverlayImageButtonProps> = ({
  memberName,
  memberClass,
  profileImageId,
  handleImageUpdate,
  memberId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const profileImage = new Image();
        const classImage = new Image();

        profileImage.crossOrigin = "anonymous";
        classImage.crossOrigin = "anonymous";

        profileImage.onload = () => {
          canvas.width = profileImage.width;
          canvas.height = profileImage.height;

          classImage.onload = () => {
            ctx.drawImage(
              profileImage,
              0,
              0,
              profileImage.width,
              profileImage.height
            );
            ctx.drawImage(
              classImage,
              0,
              0,
              profileImage.width,
              profileImage.height
            );
          };

          classImage.onerror = (e) =>
            console.error("Erro ao carregar imagem da classe:", e);
          classImage.src = getClassImage(memberClass);
        };

        profileImage.onerror = (e) =>
          console.error("Erro ao carregar imagem do perfil:", e);
        profileImage.src = `/api/members/image/${profileImageId}`;
      }
    }
  }, [memberClass, profileImageId]);

  const handleDownload = async () => {
    setIsLoading(true);
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const imageDataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageDataUrl;
        link.download = `${memberName}_profile.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Erro ao gerar ou baixar a imagem:", error);
      }
    }
    setIsLoading(false);
  };

  return (
    <Flex alignItems="center" gap="10px" direction="column">
      <Avatar as="canvas" ref={canvasRef} size="2xl" />
      <Flex>
      <EditProfileImageButton
          memberId={memberId}
          onImageUpdate={handleImageUpdate}
        />  

      </Flex>
      <Button
        onClick={handleDownload}
        isLoading={isLoading}
        loadingText="Baixando..."
      >
        Baixar Imagem
      </Button>
    </Flex>
  );
};

export default DownloadOverlayImageButton;
