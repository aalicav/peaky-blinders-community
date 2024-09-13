import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { getClassImage } from '../utils/classUtils';

interface DownloadOverlayImageButtonProps {
  memberName: string;
  memberClass: string;
  profileImageId: string;
}

const DownloadOverlayImageButton: React.FC<DownloadOverlayImageButtonProps> = ({
  memberName,
  memberClass,
  profileImageId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const profileImage = new Image();
        const classImage = new Image();

        profileImage.crossOrigin = 'anonymous';
        classImage.crossOrigin = 'anonymous';

        canvas.width = 200;
        canvas.height = 200;

        classImage.onload = () => {
          profileImage.onload = () => {
      
            ctx.drawImage(profileImage, 0, 0, 200, 200);
            ctx.drawImage(classImage, 0, 0, 200, 200);
          };
          profileImage.onerror = (e) => console.error('Erro ao carregar imagem do perfil:', e);
          profileImage.src = `/api/members/image/${profileImageId}`;
        };
        classImage.onerror = (e) => console.error('Erro ao carregar imagem da classe:', e);
        classImage.src = getClassImage(memberClass);
      }
    }
  }, [memberClass, profileImageId]);

  const handleDownload = async () => {
    setIsLoading(true);
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const imageDataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageDataUrl;
        link.download = `${memberName}_profile.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Erro ao gerar ou baixar a imagem:', error);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Button onClick={handleDownload} isLoading={isLoading} loadingText="Baixando...">
        Baixar Imagem
      </Button>
    </>
  );
};

export default DownloadOverlayImageButton;