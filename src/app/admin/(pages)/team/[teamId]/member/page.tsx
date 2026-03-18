"use client";

import { useCreateTeamMemberMutation } from "@/app/admin/features/team/teamApi";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopupBox } from "@/components/ui/popupBox";
import { Select } from "@/components/ui/select";
import { objectToFormData } from "@/lib/utils/formdata-converter";
import axios from "axios";
import { Camera } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { toast } from "react-toastify";

export default function MemberAddPage() {
  const yearOptions = [
    "1st year",
    "2nd year",
    "3rd year",
    "4th year",
    "Alumni",
    "Professor",
  ];
  const departmentOptions = [
    "IT Department",
    "CSE Department",
    "ECE Department",
    "EE Department",
    "ME Department",
    "CIVIL Department",
    "PRINCIPAL",
  ];

  const router = useRouter();

  // handle tabs
  const params = useParams();
  const teamId = params.teamId;
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const memberId = searchParams.get("id");

  // handle inputs
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    email: "",
    studyYear: "",
    department: "",
    role: "",
    linkedin: "",
    instagram: "",
    avatar: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  // Handle form changes
  const handleChange = (e: string, field: string) => {
    setFormData({
      ...formData,
      [field]: e,
    });
  };

  // image cropper
  const [isImageCropperOpen, setIsImageCropperOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [createTeamMember] = useCreateTeamMemberMutation()

  // fetch the event
  useEffect(() => {
    (async () => {
      if (!memberId || tab != "edit") return;
      try {
        await axios.get(`/api/team/member/get?id=${memberId}`).then((res) => {
          const data = res.data.data;
          if (data) {
            setFormData({
              ...data,
              linkedin: data.socialMedia?.linkedin || "",
              instagram: data.socialMedia?.instagram || "",
            });
            setPreviewUrl(data?.avatar);
          }
        });
      } catch (error) {
        toast.error("Faild to fetch member");
      }
    })();
  }, [tab, memberId]);

  // handle preview image
  useEffect(() => {
    if (croppedFile) {
      setPreviewUrl(URL.createObjectURL(croppedFile));
    }
  }, [croppedFile]);

  // create new event
  const handleCreateMember = async () => {
    if (!teamId) return;
    try {
      const data = {
        teamId,
        ...formData,
        socialMedia: {
          linkedin: formData.linkedin,
          instagram: formData.instagram,
        },
        avatar: croppedFile || formData.avatar,
      };
      const payLoads = objectToFormData(data);
      // await axios
      //   .post("/api/team/member/create", payLoads, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   })
      createTeamMember(payLoads).unwrap()
        .then(() => {
          toast.success("Member created successfully");
          router.push(`/admin/team/${teamId}`);
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  // create new event
  const handleEditMember = async () => {
    try {
      const data = {
        memberId,
        ...formData,
        avatar: croppedFile || formData.avatar,
      };
      const payLoads = objectToFormData(data);
      await axios
        .patch("/api/team/member/update", payLoads, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          toast.success("Member updated successfully");
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  // handle button click
  const [isLoading, setIsLoading] = useState(false);
  const handleButtonClick = async () => {
    setIsLoading(true);

    if (tab === "create") await handleCreateMember();
    else if (tab === "edit" && memberId) await handleEditMember();

    setIsLoading(false);
  };

  // delete event
  const handleDeleteMember = async () => {
    try {
      if (!memberId) return;
      setIsLoading(true);
      await axios.delete(`/api/team/member/remove?id=${memberId}`).then(() => {
        toast.success("Member removed successfully");
        router.push(`/admin/team/${teamId}`);
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={null}>
      <div>
        <div className="mb-10">
          <h5 className="text-2xl font-bold">
            {tab === "create" ? "Add new member" : "Edit member"}
          </h5>
        </div>
        <div className="mb-10">
          <h5 className="mb-6">Member details</h5>
          <div className="space-y-2">
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="member-name">Name *</label>
              </div>
              <Input
                placeholder="Member name"
                id="member-name"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
              />
            </div>
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="member-about">About</label>
              </div>
              <Input
                placeholder="Member about"
                id="member-about"
                value={formData.about}
                onChange={(e) => handleChange(e, "about")}
              />
            </div>
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="member-email">Email *</label>
              </div>
              <Input
                type="email"
                placeholder="Member email"
                id="member-email"
                value={formData.email}
                onChange={(e) => handleChange(e, "email")}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-2 text-sm">Study year *</div>
                <Select
                  placeholder="Select study year"
                  options={yearOptions}
                  value={formData.studyYear}
                  onChange={(value) => handleChange(value, "studyYear")}
                />
              </div>
              <div>
                <div className="mb-2 text-sm">Department *</div>
                <Select
                  placeholder="Select department"
                  options={departmentOptions}
                  value={formData.department}
                  onChange={(value) => handleChange(value, "department")}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="member-role">Role *</label>
              </div>
              <Input
                placeholder="Member Role"
                id="member-role"
                value={formData.role}
                onChange={(e) => handleChange(e, "role")}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-2 text-sm">
                  <label htmlFor="linkedin">LinkedIn</label>
                </div>
                <Input
                  placeholder="Linkedin profile"
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleChange(e, "linkedin")}
                />
              </div>
              <div>
                <div className="mb-2 text-sm">
                  <label htmlFor="instagram">Instagram</label>
                </div>
                <Input
                  placeholder="Instagram profile"
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleChange(e, "instagram")}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-fit h-fit p-1 border-1 border-blue-500 rounded-full">
                <Avatar className="w-20 h-20" src={previewUrl} />
              </div>
              <label
                htmlFor="member-profile"
                className="cursor-pointer bg-gray-200 p-2 rounded-xl"
              >
                <Camera />
                <input
                  type="file"
                  name=""
                  id="member-profile"
                  accept="image/*"
                  multiple={false}
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                      setIsImageCropperOpen(true);
                    }
                  }}
                />
              </label>
              <p>Add profile picture</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          {tab !== "create" && (
            <Button
              className="bg-red-400"
              disabled={isLoading}
              onClick={handleDeleteMember}
            >
              Remove member
            </Button>
          )}
          <Button
            variant="success"
            onClick={handleButtonClick}
            disabled={isLoading}
          >
            {tab === "create"
              ? isLoading
                ? "Creating..."
                : "Add Member"
              : isLoading
                ? "Saving..."
                : "Save Changes"}
          </Button>
        </div>
        <ImageCropper
          openState={isImageCropperOpen}
          onClose={() => {
            setIsImageCropperOpen(false);
            setFile(null);
          }}
          file={file}
          onCropComplete={(blob) => setCroppedFile(blob)}
        />
      </div>
    </Suspense>
  );
}

// Image cropper component
const ImageCropper = ({
  openState,
  onClose,
  file,
  onCropComplete,
}: {
  openState: boolean;
  onClose: () => void;
  file: File | null;
  onCropComplete: (croppedFile: File | null) => void;
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Load the file as data URL
  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
  }, [file]);

  const onCropDone = async () => {
    if (!croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], `cropped_${file?.name}`, {
      type: file?.type,
    });
    onCropComplete(croppedFile);
    onClose();
    setImageSrc("");
  };

  const onCropCompleteHandler = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  return (
    <PopupBox openState={openState} onClose={onClose}>
      <div>
        <div className="md:w-[80vw] w-[90vw] md:h-[65svh] h-[80svh] overflow-y-auto relative mb-3">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onCropDone}>
            Crop & save
          </Button>
        </div>
      </div>
    </PopupBox>
  );
};

// cropped image creater
async function getCroppedImg(imageSrc: string, crop: any): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/jpeg");
  });
}
