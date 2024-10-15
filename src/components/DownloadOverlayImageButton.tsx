import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Flex } from "@chakra-ui/react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<HTMLImageElement | null>(null);
  const [classImage, setClassImage] = useState<HTMLImageElement | null>(null);
  const [profileImagePosition, setProfileImagePosition] = useState({ x: 0, y: 0 });
  const [classImagePosition, setClassImagePosition] = useState({ x: 0, y: 0 });
  const [profileImageScale, setProfileImageScale] = useState({ x: 1, y: 1 });
  const [classImageScale, setClassImageScale] = useState({ x: 1, y: 1 });
  const [isOverlaySelected, setIsOverlaySelected] = useState(false);
  const [isProfileSelected, setIsProfileSelected] = useState(false);

  const stageRef = useRef(null);
  const overlayRef = useRef(null);
  const profileImageRef = useRef(null);
  const profileTransformerRef = useRef<any>(null);
  const overlayTransformerRef = useRef<any>(null);

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

      profileImg.src = `/api/members/image/${profileImageId}`;
      classImg.src = getClassImage(memberClass);
    };

    loadImages();
  }, [memberClass, profileImageId]);

  const handleFinalizeAndDownload = async () => {
    setIsLoading(true);
    if (stageRef.current && profileImage) {
      const stage = stageRef.current as any;
      const dataURL = stage.toDataURL();
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${memberName}_profile.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsEditMode(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profileTransformerRef.current && profileImageRef.current && isProfileSelected) {
      profileTransformerRef.current.nodes([profileImageRef.current]);
      profileTransformerRef.current.getLayer().batchDraw();
    }

    if (overlayTransformerRef.current && overlayRef.current && isOverlaySelected) {
      overlayTransformerRef.current.nodes([overlayRef.current]);
      overlayTransformerRef.current.getLayer().batchDraw();
    }
  }, [isOverlaySelected, isProfileSelected]);

  // Evento de clique ou toque no Stage
  const handleStageMouseDown = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setIsOverlaySelected(false);
      setIsProfileSelected(false);
    }
  };

  const handleStageTouchStart = (e: any) => {
    const touchedOnEmpty = e.target === e.target.getStage();
    if (touchedOnEmpty) {
      setIsOverlaySelected(false);
      setIsProfileSelected(false);
    }
  };

  const getStageDimensions = () => {
    const canvasWidth = Math.min(window.innerWidth * 0.9, 600);
    const canvasHeight = Math.min(window.innerHeight * 0.6, 400);
    return { width: canvasWidth, height: canvasHeight };
  };

  const { width, height } = getStageDimensions();

  useEffect(() => {
    if (profileImage) {
      const scale = Math.min(width / profileImage.width, height / profileImage.height);
      setProfileImageScale({ x: scale, y: scale });
      const initialX = (width - profileImage.width * scale) / 2;
      const initialY = (height - profileImage.height * scale) / 2;
      setProfileImagePosition({ x: initialX, y: initialY });
    }

    if (classImage) {
      const scale = Math.min(width / classImage.width, height / classImage.height);
      setClassImageScale({ x: scale, y: scale });
      const initialX = (width - classImage.width * scale) / 2;
      const initialY = (height - classImage.height * scale) / 2;
      setClassImagePosition({ x: initialX, y: initialY });
    }
  }, [profileImage, classImage, width, height]);

  return (
    <Flex alignItems="center" gap="10px" direction={['column', 'column', 'row']} p={4} width="100%">
      {!isEditMode ? (
        <>
          <Avatar src={`/api/members/image/${profileImageId}`} size={['xl', '2xl']} />
          <Flex direction="column" alignItems="center" w="100%">
            <EditProfileImageButton memberId={memberId} onImageUpdate={handleImageUpdate} />
            <Button size={['sm', 'md']} onClick={() => setIsEditMode(true)}>
              Baixar Imagem
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <Flex overflow="hidden" border="1px solid" borderColor="gray.200" borderRadius="md" w="100%" maxWidth="600px" mx="auto">
            <Stage
              width={width}
              height={height}
              ref={stageRef}
              onMouseDown={handleStageMouseDown}
              onTouchStart={handleStageTouchStart}
            >
              <Layer>
                {profileImage && (
                  <KonvaImage
                    image={profileImage}
                    x={profileImagePosition.x}
                    y={profileImagePosition.y}
                    scaleX={profileImageScale.x}
                    scaleY={profileImageScale.y}
                    draggable
                    ref={profileImageRef}
                    onClick={() => {
                      setIsProfileSelected(true);
                      setIsOverlaySelected(false);
                    }}
                    onTouchStart={() => {
                      setIsProfileSelected(true);
                      setIsOverlaySelected(false);
                    }}
                    onDragEnd={(e) => {
                      setProfileImagePosition({
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    onTransformEnd={(e) => {
                      const node = profileImageRef.current as any;
                      const scaleX = node ? node.scaleX() : 1;
                      const scaleY = node ? node.scaleY() : 1;
                      setProfileImageScale({ x: scaleX, y: scaleY });
                      node.scaleX(1);
                      node.scaleY(1);
                    }}
                  />
                )}
                {classImage && (
                  <KonvaImage
                    image={classImage}
                    x={classImagePosition.x}
                    y={classImagePosition.y}
                    ref={overlayRef}
                    scaleX={classImageScale.x}
                    scaleY={classImageScale.y}
                    draggable
                    onClick={() => {
                      setIsOverlaySelected(true);
                      setIsProfileSelected(false);
                    }}
                    onTouchStart={() => {
                      setIsOverlaySelected(true);
                      setIsProfileSelected(false);
                    }}
                    onDragEnd={(e) => {
                      setClassImagePosition({
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    onTransformEnd={(e) => {
                      const node = overlayRef.current as any;
                      const scaleX = node ? node.scaleX() : 1;
                      const scaleY = node ? node.scaleY() : 1;
                      setClassImageScale({ x: scaleX, y: scaleY });
                      node.scaleX(1);
                      node.scaleY(1);
                    }}
                  />
                )}
                {isOverlaySelected && (
                  <Transformer
                    ref={overlayTransformerRef}
                    resizeEnabled={true}
                    keepRatio={true}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                  />
                )}
                {isProfileSelected && (
                  <Transformer
                    ref={profileTransformerRef}
                    resizeEnabled={true}
                    keepRatio={true}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                  />
                )}
              </Layer>
            </Stage>
          </Flex>
          <Button onClick={handleFinalizeAndDownload} isLoading={isLoading} loadingText="Baixando..." size={['sm', 'md']} mt={4}>
            Confirmar
          </Button>
        </>
      )}
    </Flex>
  );
};

export default DownloadOverlayImageButton;
