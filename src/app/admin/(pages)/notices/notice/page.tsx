"use client";

import { useCreateNoticeMutation, useDeleteNoticeMutation, useGetNoticeByIdQuery, useUpdateNoticeMutation } from "@/app/admin/features/notice/noticeApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textArea";
import { objectToFormData } from "@/lib/utils/formdata-converter";
import axios from "axios";
import clsx from "clsx";
import { FilePlus, SquareArrowOutUpRight, View } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EventAddPage() {
  const router = useRouter();
  // handle tabs
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const noticeId = searchParams.get("id");

  // handle inputs
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPinned: false,
    pdfTitle: "",
    pdfUrl: "",
  });
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { data: noticeById } = useGetNoticeByIdQuery(noticeId);
  const noticeByIdData = noticeById?.data;

  const [createNotice] = useCreateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();
  const [updateNotice] = useUpdateNoticeMutation()

  // Handle form changes
  const handleChange = (e: any, field: string) => {
    setFormData({
      ...formData,
      [field]: e,
    });
  };

  // fetch the notice
  useEffect(() => {
    (async () => {
      if (!noticeId || tab != "edit") return;
      try {
        if (noticeByIdData) setFormData(noticeByIdData);
        setPdfUrl(noticeByIdData?.pdfUrl);

      } catch (error) {
        toast.error("Faild to fetch notice");
      }
    })();
  }, [noticeById]);

  // handle preview image
  useEffect(() => {
    if (file) {
      setPdfUrl(URL.createObjectURL(file));
    }
  }, [file]);

  // create new notice
  const handleCreateNewNotice = async () => {
    try {
      const data = {
        ...formData,
        noticePdf: file,
      };
      const payLoads = objectToFormData(data);
      // await axios
      //   .post("/api/notice/create", payLoads, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   })
      await createNotice(payLoads).unwrap()
        .then(() => {
          toast.success("Notice created successfully");
          router.push("/admin/notices");
        });
    } catch (error: any) {
      console.log("RTK Error:", error);

      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.error) {
        toast.error(error.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // edit notice
  const handleEditNotice = async () => {
    try {
      const data = {
        ...formData,
        noticePdf: file || formData.pdfUrl,
      };
      const payLoads = objectToFormData(data);
      // await axios
      //   .patch(`/api/notice/update?id=${noticeId}`, payLoads, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   })
      await updateNotice({ noticeId, body: payLoads }).unwrap()
        .then(() => {
          toast.success("Notice updated successfully");
        });
    } catch (error: any) {
      console.log("RTK Error:", error);

      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.error) {
        toast.error(error.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // handle button click
  const [isLoading, setIsLoading] = useState(false);
  const handleButtonClick = async () => {
    setIsLoading(true);

    if (tab === "create") await handleCreateNewNotice();
    else if (tab === "edit" && noticeId) await handleEditNotice();

    setIsLoading(false);
  };

  // delete notice
  const handleDeleteNotice = async () => {
    try {
      if (!noticeId) return;
      // await axios.delete(`/api/notice/remove?id=${noticeId}`)
      await deleteNotice(noticeId).unwrap()
        .then(() => {
          toast.success("Notice removed successfully");
          router.push(`/admin/notices`);
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  return (
    <Suspense fallback={null}>
      <div>
        <div className="mb-10">
          <h5 className="text-2xl font-bold">
            {tab === "create" ? "Add new Notice" : "Edit Notice"}
          </h5>
        </div>
        <div className="mb-10">
          <h5 className="mb-6">Notice details</h5>
          <div className="space-y-2">
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="notice-title">Notice title</label>
              </div>
              <Input
                placeholder="Title"
                id="notice-title"
                value={formData.title}
                onChange={(e) => handleChange(e, "title")}
                disabled={isLoading}
              />
            </div>
            <div>
              <div className="mb-2 text-sm">
                <label htmlFor="notice-description">Notice description</label>
              </div>
              <TextArea
                placeholder="Description"
                id="notice-description"
                value={formData.description}
                onChange={(e) => handleChange(e, "description")}
                disabled={isLoading}
              />
            </div>
            <label
              htmlFor="notice-pin"
              className={clsx(
                "flex items-center gap-3 px-4 h-12 border border-gray-400 rounded-2xl cursor-pointer",
                formData.isPinned && "border-blue-500!",
              )}
            >
              <input
                type="checkbox"
                id="notice-pin"
                checked={formData.isPinned}
                onChange={(e) => handleChange(e.target.checked, "isPinned")}
                disabled={isLoading}
              />
              <span>Pin This notice</span>
            </label>
            <div className="flex items-center gap-3">
              <div>
                <div className="mb-2 text-sm">
                  <label htmlFor="notice-doc">Notice pdf</label>
                </div>
                <label
                  htmlFor="notice-doc"
                  className="cursor-pointer flex items-center gap-3 rounded-2xl h-12 px-4 border border-gray-400"
                >
                  <FilePlus size={20} className="text-blue-400" />
                  <div className="text-gray-500">
                    {pdfUrl ? "Change" : "Upload"} notice pdf
                  </div>
                  <input
                    type="file"
                    id="notice-doc"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files![0])}
                    disabled={isLoading}
                  />
                </label>
              </div>
              <div>
                <div className="mb-2 text-sm">
                  <label htmlFor="notice-pdf-title">Notice pdf title</label>
                </div>
                <Input
                  placeholder="Notice Pdf title"
                  id="notice-pdf-title"
                  value={formData.pdfTitle}
                  onChange={(e) => handleChange(e, "pdfTitle")}
                  disabled={isLoading}
                />
              </div>
            </div>
            {pdfUrl && (
              <div>
                <a
                  href={pdfUrl}
                  target="_blank"
                  className="text-blue-500 flex items-center gap-2 p-2 border border-transparent hover:border-blue-300 w-fit rounded-2xl"
                >
                  <View size={19} className="text-green-600" />
                  <span>{formData.pdfTitle || "View notice document"}</span>
                  <SquareArrowOutUpRight size={19} />
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          {tab !== "create" && (
            <Button
              className="bg-red-400"
              disabled={isLoading}
              onClick={handleDeleteNotice}
            >
              Remove notice
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
                : "Create Notice"
              : isLoading
                ? "Saving..."
                : "Save Notice"}
          </Button>
        </div>
      </div>
    </Suspense>
  );
}
