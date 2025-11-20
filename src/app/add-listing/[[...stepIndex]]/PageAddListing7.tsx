"use client";
import { useEffect, useState } from "react";
import React, { FC } from "react";
import { useBunnyUpload } from "@/utils/bunnyUpload";
import { Upload, X, Image as ImageIcon, Loader2, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export interface PageAddListing7Props {}

const PageAddListing7: FC<PageAddListing7Props> = () => {
  let portions = 0;
  const data = localStorage.getItem("page1") || "";
  if (data) {
    const value = JSON.parse(data)["numberOfPortions"];
    if (value) {
      portions = parseInt(value, 10);
    }
  }
  let checkPortion = portions > 1 ? portions : 0;

  const booleanArray = Array.from({ length: portions }, () => false);
  const emptyStringArrayGenerator = (size: number) => {
    const emptyStringArray = Array.from({ length: size }, () => "");
    return emptyStringArray;
  };

  // States for property and portion images
  const [portionCoverFileUrls, setPortionCoverFileUrls] = useState<string[]>(
    () => {
      const savedUrls = localStorage.getItem("portionCoverFileUrls");
      if (savedUrls?.length != portions) {
        return emptyStringArrayGenerator(portions);
      }
      return savedUrls
        ? JSON.parse(savedUrls)
        : emptyStringArrayGenerator(portions);
    }
  );

  const [propertyCoverFileUrl, setPropertyCoverFileUrl] = useState<string>(
    () => {
      const savedUrls = localStorage.getItem("propertyCoverFileUrl");
      return savedUrls ? savedUrls : "";
    }
  );

  const [portionPictureUrls, setPortionPictureUrls] = useState<string[][]>(
    () => {
      const savedUrls = localStorage.getItem("portionPictureUrls") || "";
      const arrayOf5 = Array(5).fill("");

      if (savedUrls.length != portions) {
        return Array(portions).fill(arrayOf5);
      }

      return savedUrls ? JSON.parse(savedUrls) : Array(portions).fill(arrayOf5);
    }
  );

  const [isPortionPictures, setIsPortionPictures] = useState<boolean[]>(() => {
    const savedFlags = localStorage.getItem("isPortionPictures");
    return savedFlags ? JSON.parse(savedFlags) : Array(portions).fill(false);
  });

  const [propertyPictureUrls, setPropertyPictureUrls] = useState<string[]>(
    () => {
      const savedUrls = localStorage.getItem("propertyPictureUrls");
      return savedUrls ? JSON.parse(savedUrls) : Array(5).fill("");
    }
  );

  const [isPropertyPictures, setIsPropertyPictures] = useState<boolean>(() => {
    const savedFlag = localStorage.getItem("isPropertyPictures");
    return savedFlag ? JSON.parse(savedFlag) : false;
  });

  const [isImages, setIsImages] = useState<boolean[]>(() => {
    const savedFlag = localStorage.getItem("isImages");
    return savedFlag ? JSON.parse(savedFlag) : booleanArray;
  });

  // Loading states
  const [propertyCoverFileLoading, setPropertyCoverFileLoading] = useState(false);
  const [propertyPicturesLoading, setPropertyPicturesLoading] = useState(false);
  const [portionCoverFileLoading, setPortionCoverFileLoading] = useState<boolean[]>(
    Array.from({ length: checkPortion }, () => false)
  );
  const [portionPicturesLoading, setPortionPicturesLoading] = useState<boolean[]>(
    Array.from({ length: checkPortion }, () => false)
  );

  // Use Bunny upload hook
  const { uploadFiles, loading: bunnyLoading } = useBunnyUpload();

  // Get place name for folder structure
  let placeName = JSON.parse(localStorage.getItem("page1") || "").placeName;
  placeName = placeName.toLowerCase().split(" ").join("_");

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("propertyCoverFileUrl", propertyCoverFileUrl);
  }, [propertyCoverFileUrl]);

  useEffect(() => {
    localStorage.setItem("portionPictureUrls", JSON.stringify(portionPictureUrls));
  }, [portionPictureUrls]);

  useEffect(() => {
    localStorage.setItem("isPortionPictures", JSON.stringify(isPortionPictures));
  }, [isPortionPictures]);

  useEffect(() => {
    localStorage.setItem("propertyPictureUrls", JSON.stringify(propertyPictureUrls));
  }, [propertyPictureUrls]);

  useEffect(() => {
    localStorage.setItem("isPropertyPictures", JSON.stringify(isPropertyPictures));
  }, [isPropertyPictures]);

  useEffect(() => {
    localStorage.setItem("portionCoverFileUrls", JSON.stringify(portionCoverFileUrls));
  }, [portionCoverFileUrls]);

  useEffect(() => {
    localStorage.setItem("isImages", JSON.stringify(isImages));
  }, [isImages]);

  // Upload property cover image
  const uploadPropertyCoverFile = async (event: any) => {
    const file = event?.target.files[0];
    if (!file) return;

    if (
      !(
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp"
      )
    ) {
      alert("Error: Only PNG, JPEG, and WEBP files are allowed.");
      return;
    }

    setPropertyCoverFileLoading(true);
    try {
      const { imageUrls, error } = await uploadFiles(file, `${placeName}/property-cover`);
      if (error) {
        alert(`Upload error: ${error}`);
      } else if (imageUrls.length > 0) {
        setPropertyCoverFileUrl(imageUrls[0]);
      }
    } catch (error) {
      alert("Error uploading image. Please try again.");
    } finally {
      setPropertyCoverFileLoading(false);
    }
  };

  // Upload property pictures
  const uploadPropertyPictures = async (event: any) => {
    const files = event?.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (
        !(
          files[i].type === "image/png" ||
          files[i].type === "image/jpeg" ||
          files[i].type === "image/webp"
        )
      ) {
        alert("Error: Only PNG, JPEG, and WEBP files are allowed.");
        return;
      }
    }

    setPropertyPicturesLoading(true);
    try {
      const fileArray = Array.from(files).slice(0, 5);
      const { imageUrls, error } = await uploadFiles(fileArray as File[], `${placeName}/property-pictures`);
      if (error) {
        alert(`Upload error: ${error}`);
      } else if (imageUrls.length > 0) {
        const savedUrls = [...propertyPictureUrls];
        imageUrls.forEach((url, i) => {
          if (i < 5) savedUrls[i] = url;
        });
        setPropertyPictureUrls(savedUrls);
        setIsPropertyPictures(true);
      }
    } catch (error) {
      alert("Error uploading images. Please try again.");
    } finally {
      setPropertyPicturesLoading(false);
    }
  };

  // Upload portion cover image
  const uploadPortionCoverFile = async (event: any, index: number) => {
    const file = event?.target.files[0];
    if (!file) return;

    if (
      !(
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp"
      )
    ) {
      alert("Error: Only PNG, JPEG, and WEBP files are allowed.");
      return;
    }

    setPortionCoverFileLoading((prev) => {
      const newArray = [...prev];
      newArray[index] = true;
      return newArray;
    });

    try {
      const { imageUrls, error } = await uploadFiles(file, `${placeName}/portion-${index + 1}-cover`);
      if (error) {
        alert(`Upload error: ${error}`);
      } else if (imageUrls.length > 0) {
        setPortionCoverFileUrls((prevState) => {
          const newUrls = [...prevState];
          newUrls[index] = imageUrls[0];
          return newUrls;
        });
        setIsImages((prevState) => {
          const newImages = [...prevState];
          newImages[index] = true;
          return newImages;
        });
      }
    } catch (error) {
      alert("Error uploading image. Please try again.");
    } finally {
      setPortionCoverFileLoading((prev) => {
        const newArray = [...prev];
        newArray[index] = false;
        return newArray;
      });
    }
  };

  // Upload portion pictures
  const uploadPortionPictures = async (event: any, index: number) => {
    const files = event?.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (
        !(
          files[i].type === "image/png" ||
          files[i].type === "image/jpeg" ||
          files[i].type === "image/webp"
        )
      ) {
        alert("Error: Only PNG, JPEG, and WEBP files are allowed.");
        return;
      }
    }

    setPortionPicturesLoading((prevState) => {
      const newLoading = [...prevState];
      newLoading[index] = true;
      return newLoading;
    });

    try {
      const fileArray = Array.from(files).slice(0, 5);
      const { imageUrls, error } = await uploadFiles(fileArray as File[], `${placeName}/portion-${index + 1}-pictures`);
      if (error) {
        alert(`Upload error: ${error}`);
      } else if (imageUrls.length > 0) {
        setPortionPictureUrls((prevState) => {
          const newUrls = [...prevState];
          newUrls[index] = imageUrls;
          return newUrls;
        });
        setIsPortionPictures((prevState) => {
          const newPictures = [...prevState];
          newPictures[index] = true;
          return newPictures;
        });
      }
    } catch (error) {
      alert("Error uploading images. Please try again.");
    } finally {
      setPortionPicturesLoading((prevState) => {
        const newLoading = [...prevState];
        newLoading[index] = false;
        return newLoading;
      });
    }
  };

  // Generate stable unique ID for file inputs
  const propertyUploadId = "property-upload";
  const propertyGalleryId = "property-gallery";

  // Upload area component
  const UploadArea = ({
    isLoading,
    isUploaded,
    imageUrl,
    onUpload,
    onDelete,
    isMultiple = false,
    images = [],
    uploadId,
  }: {
    isLoading: boolean;
    isUploaded: boolean;
    imageUrl?: string;
    images?: string[];
    onUpload: (e: any) => void;
    onDelete: () => void;
    isMultiple?: boolean;
    uploadId: string;
  }) => (
    <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-6">
      {!isUploaded ? (
        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <>
              <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="text-center">
                <label htmlFor={uploadId} className="cursor-pointer">
                  <span className="font-medium text-sky-600 hover:text-sky-700">Click to upload</span>
                  <input
                    id={uploadId}
                    type="file"
                    className="sr-only"
                    multiple={isMultiple}
                    accept="image/*"
                    onChange={onUpload}
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Check className="w-10 h-10 text-emerald-600" />
          {!isMultiple ? (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-48 h-48 rounded-lg object-cover border border-gray-200"
            />
          ) : (
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                img && (
                  <img
                    key={i}
                    src={img}
                    alt={`Image ${i + 1}`}
                    className="w-28 h-28 rounded-lg object-cover border border-gray-200"
                  />
                )
              ))}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="mt-2"
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Property Images Section */}
      <div className="space-y-6">
        {/* Property Cover Image */}
        <Card className="p-8 border-2">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-6 h-6 text-sky-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Property Cover Image
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This image will be the first impression of your property
              </p>
            </div>
          </div>

          <UploadArea
            isLoading={propertyCoverFileLoading}
            isUploaded={propertyCoverFileUrl.length > 0}
            imageUrl={propertyCoverFileUrl}
            onUpload={uploadPropertyCoverFile}
            onDelete={() => setPropertyCoverFileUrl("")}
            uploadId={propertyUploadId}
          />
        </Card>

        {/* Property Pictures */}
        <Card className="p-8 border-2">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Property Gallery
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload up to 5 images showcasing your property
              </p>
            </div>
          </div>

          <UploadArea
            isLoading={propertyPicturesLoading}
            isUploaded={isPropertyPictures}
            images={propertyPictureUrls.filter(Boolean)}
            onUpload={uploadPropertyPictures}
            onDelete={() => {
              setPropertyPictureUrls(emptyStringArrayGenerator(5));
              setIsPropertyPictures(false);
            }}
            isMultiple
            uploadId={propertyGalleryId}
          />
        </Card>
      </div>

      {/* Portions Images Section */}
      {Array.from({ length: checkPortion }, (_, index) => (
        <div key={index} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Portion {index + 1}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Beautiful photos help guests connect with your space
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Unit {index + 1}
            </Badge>
          </div>

          {/* Portion Cover Image */}
          <Card className="p-8 border-2 border-sky-200 dark:border-sky-900/30">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-5 h-5 text-sky-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Cover Image
              </h3>
            </div>

            <UploadArea
              isLoading={portionCoverFileLoading[index]}
              isUploaded={isImages[index]}
              imageUrl={portionCoverFileUrls[index]}
              onUpload={(e) => uploadPortionCoverFile(e, index)}
              onDelete={() => {
                setIsImages((prev) => {
                  const newImages = [...prev];
                  newImages[index] = false;
                  return newImages;
                });
                setPortionCoverFileUrls((prev) => {
                  const newUrls = [...prev];
                  newUrls[index] = "";
                  return newUrls;
                });
              }}
              uploadId={`portion-${index}-cover`}
            />
          </Card>

          {/* Portion Pictures */}
          <Card className="p-8 border-2 border-emerald-200 dark:border-emerald-900/30">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Gallery Images
              </h3>
            </div>

            <UploadArea
              isLoading={portionPicturesLoading[index]}
              isUploaded={isPortionPictures[index]}
              images={portionPictureUrls[index]?.filter(Boolean) || []}
              onUpload={(e) => uploadPortionPictures(e, index)}
              onDelete={() => {
                setPortionPictureUrls((prev) => {
                  const newUrls = [...prev];
                  newUrls[index] = emptyStringArrayGenerator(5);
                  return newUrls;
                });
                setIsPortionPictures((prev) => {
                  const newPictures = [...prev];
                  newPictures[index] = false;
                  return newPictures;
                });
              }}
              isMultiple
              uploadId={`portion-${index}-gallery`}
            />
          </Card>
        </div>
      ))}
    </div>
  );
};

export default PageAddListing7;
