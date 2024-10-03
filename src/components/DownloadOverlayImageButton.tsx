import React, { useEffect, useRef, useState, useCallback } from "react";
import { Avatar, Button, Flex } from "@chakra-ui/react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import Cropper from "react-easy-crop";
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
  const [isEditMode, setIsEditMode] = useState(false); // State to toggle between view and edit modes
  const [profileImage, setProfileImage] = useState<HTMLImageElement | null>(null);
  const [classImage, setClassImage] = useState<HTMLImageElement | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [overlayScale, setOverlayScale] = useState({ x: 1, y: 1 });
  const [isOverlaySelected, setIsOverlaySelected] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  // Load profile image and class image
  useEffect(() => {
    const loadImages = () => {
      const profileImg = new window.Image();
      const classImg = new window.Image();

      profileImg.crossOrigin = "anonymous";
      classImg.crossOrigin = "anonymous";

      profileImg.onload = () => {
        setProfileImage(profileImg);
      };

      classImg.onload = () => {
        setClassImage(classImg);
      };

      profileImg.onerror = (e) => console.error("Erro ao carregar imagem do perfil:", e);
      classImg.onerror = (e) => console.error("Erro ao carregar imagem da classe:", e);

      profileImg.src = `/api/members/image/${profileImageId}`;
      classImg.src = getClassImage(memberClass);
    };

    loadImages();
  }, [memberClass, profileImageId]);

  // Function to handle download after editing
  const handleFinalizeAndDownload = async () => {
    setIsLoading(true);
    if (stageRef.current && profileImage) {
      // Extract the data URL of the edited stage
      const stage = stageRef.current as any;
      const dataURL = stage.toDataURL();
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${memberName}_profile.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset edit mode
      setIsEditMode(false);
      setIsLoading(false);
    }
  };

  // Function to start editing mode
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // Use effect to add transformer controls to the overlay image
  useEffect(() => {
    if (transformerRef.current && overlayRef.current && isOverlaySelected) {
      transformerRef.current.nodes([overlayRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isOverlaySelected]);

  // Prevent stage from deselecting transformer when clicked
  const handleStageMouseDown = (e: any) => {
    // Deselect only when the clicked area is not the overlay image
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setIsOverlaySelected(false);
    }
  };

  return (
    <Flex alignItems="center" gap="10px" direction="column">
      {!isEditMode ? (
        // Default View Mode with Avatar
        <>
          <Avatar src={`/api/members/image/${profileImageId}`} size="2xl" />
          <Flex>
            <EditProfileImageButton
              memberId={memberId}
              onImageUpdate={handleImageUpdate}
            />
          </Flex>
          <Button onClick={handleEdit}>Baixar Imagem</Button>
        </>
      ) : (
        // Edit Mode with Konva Stage
        <>
          <Stage
            width={profileImage?.width || 300}
            height={profileImage?.height || 300}
            ref={stageRef}
            onMouseDown={handleStageMouseDown}
            onTouchStart={handleStageMouseDown}
          >
            <Layer>
              {/* Profile image as background */}
              {profileImage && (
                <KonvaImage
                  image={profileImage}
                  x={0}
                  y={0}
                />
              )}
              {/* Draggable and resizable overlay image */}
              {classImage && (
                <KonvaImage
                  image={classImage}
                  x={imagePosition.x}
                  y={imagePosition.y}
                  ref={overlayRef}
                  scaleX={overlayScale.x}
                  scaleY={overlayScale.y}
                  draggable
                  onClick={() => setIsOverlaySelected(true)}
                  onTap={() => setIsOverlaySelected(true)}
                  onDragEnd={(e) => {
                    setImagePosition({ x: e.target.x(), y: e.target.y() });
                  }}
                  onTransformEnd={(e) => {
                    // Update the scale of the overlay after resizing
                    const node = overlayRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    setOverlayScale({ x: scaleX, y: scaleY });
                    node.scaleX(1);
                    node.scaleY(1);
                  }}
                />
              )}
              {/* Transformer for resizing */}
              {isOverlaySelected && (
                <Transformer
                  ref={transformerRef}
                  resizeEnabled={true}
                  keepRatio={true}
                  enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                />
              )}
            </Layer>
          </Stage>
          {/* Finalize Button to download and exit edit mode */}
          <Button
            onClick={handleFinalizeAndDownload}
            isLoading={isLoading}
            loadingText="Baixando..."
          >
            Confirmar
          </Button>
        </>
      )}
    </Flex>
  );
};

export default DownloadOverlayImageButton;
