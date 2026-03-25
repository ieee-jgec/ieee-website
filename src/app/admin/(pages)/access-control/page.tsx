"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopupBox } from "@/components/ui/popupBox";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/context/authContext";
import { Pen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetUserListQuery,
  useUpdatePasswordMutation,
  useUpdateRoleMutation,
} from "../../features/user/userApi";

export default function AccessPage() {
  const router = useRouter();
  const { user, logout, isLoggingOut } = useAuth();
  const isAdminRole = user?.role === "admin";

  const { data, isFetching } = useGetUserListQuery();
  const userList = data?.data ?? [];

  const handleLogout = async () => {
    await logout();
    router.push("/admin/auth/login");
  };

  // handle password update popup
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);

  const [updatePassword, { isLoading: isPasswordUpdating }] =
    useUpdatePasswordMutation();

  const handlePasswordUpdate = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) return;
    try {
      await updatePassword(passwordForm)
        .unwrap()
        .then(() => {
          toast.success("Password updated successfully");
          setIsPasswordPopupOpen(false);
          setPasswordForm({ currentPassword: "", newPassword: "" });
        });
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold">Access Controls</h2>
        <p className="text-gray-700">Monitor member controls</p>
      </div>
      {/* Current Admin details go here */}
      <div className="bg-[var(--card)] p-4 rounded-lg shadow-md space-y-2">
        <h3 className="text-xl mb-4">Current Admin Details</h3>
        <p>
          <strong>Admin Name:</strong> {user?.userName}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>

        <Button className="mt-6" onClick={() => setIsPasswordPopupOpen(true)}>
          Update password
        </Button>
      </div>
      {/* Other Authorised member Details  */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          {isAdminRole && (
            <Button
              onClick={() => router.push("/admin/access-control/add-user")}
            >
              <Plus size={15} />
              Add new user
            </Button>
          )}
          <Button
            className="bg-red-500"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            Logout
          </Button>
        </div>
        {isAdminRole && (
          <>
            <h3 className="text-xl mb-4">Other users</h3>
            <div className="space-y-4">
              {userList?.map((member: any, index: number) => (
                <AuthorizedMemberCard data={member} key={index} />
              ))}
            </div>
            {userList?.length === 0 ||
              (!isAdminRole && (
                <div className="text-center">No users found!</div>
              ))}
          </>
        )}
      </div>

      <PopupBox
        className="p-3 !max-w-[30em] w-full space-y-6"
        openState={isPasswordPopupOpen}
        onClose={() => setIsPasswordPopupOpen(false)}
      >
        <h5 className="text-xl mb-4">Update password</h5>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Enter current password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, currentPassword: e }))
            }
            disabled={isPasswordUpdating}
          />
          <Input
            type="password"
            placeholder="Enter new password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, newPassword: e }))
            }
            disabled={isPasswordUpdating}
          />
        </div>

        <div className="flex items-center gap-3 justify-end">
          <Button
            variant="nav"
            onClick={() => setIsPasswordPopupOpen(false)}
            disabled={isPasswordUpdating}
          >
            Cancel
          </Button>
          <Button onClick={handlePasswordUpdate} disabled={isPasswordUpdating}>
            {isPasswordUpdating ? "Updating..." : "Update password"}
          </Button>
        </div>
      </PopupBox>
    </div>
  );
}

const AuthorizedMemberCard = ({ data }: { data: Record<string, any> }) => {
  // handle role
  const [userRole, setUserRole] = useState(data?.role);
  const [updateRole, { isLoading: isRoleUpdating }] = useUpdateRoleMutation();

  // handle user role popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleRoleUpdate = async (role: string) => {
    try {
      if (!data) return;
      // setIsRoleUpdating(true);
      await updateRole({ userId: data?._id, role })
        .unwrap()
        .then(() => {
          setUserRole(role);
          setIsPopupOpen(false);
          toast.success("User role updated");
        });
    } catch (error) {
      toast.error("Failed to update user role.");
    }
  };

  return (
    <div className="flex p-2 px-4 bg-white rounded-lg shadow-md justify-between items-center gap-2">
      <div>
        <p>Name: {data?.userName}</p>
        <p>Email: {data?.email}</p>
      </div>
      <div className="flex gap-4">
        <p className=" bg-gray-200 py-2 px-4 rounded-md flex items-center justify-center w-[250px] m-0">
          {" "}
          {userRole}
        </p>
        <Button variant="success" onClick={() => setIsPopupOpen(true)}>
          <Pen size={15} />
          Edit Role
        </Button>
      </div>

      <PopupBox
        className="p-3 !max-w-[30em] w-full"
        openState={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      >
        <h5 className="text-xl mb-4">Update user role</h5>
        <Select
          placeholder="Select user role"
          value={userRole}
          options={["admin", "member"]}
          onChange={handleRoleUpdate}
          disabled={isRoleUpdating}
        />
        {isRoleUpdating && (
          <p className="text-sm text-green-500 mt-4 text-center">
            Updating role...
          </p>
        )}
      </PopupBox>
    </div>
  );
};
