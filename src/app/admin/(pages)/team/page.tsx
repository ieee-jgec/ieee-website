"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopupBox } from "@/components/ui/popupBox";
import { Select } from "@/components/ui/select";
import { Pencil, Plus, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateTeamMutation,
  useGetTeamQuery,
} from "../../features/team/teamApi";

export default function TeamAdminPage() {
  const [isCreateActive, setIsCreateActive] = useState(false);

  const { isLoading, isFetching, data } = useGetTeamQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });
  const teams = data?.data ?? [];

  return (
    <div>
      <div className="mb-10">
        <h5 className="text-2xl font-bold">Manage Teams</h5>
        <p className="text-sm text-gray-600">Add, remove or edit teams</p>
      </div>
      <div className="space-y-6">
        <div>
          <Button variant="primary" onClick={() => setIsCreateActive(true)}>
            <Plus size={15} />
            Create new Team
          </Button>
        </div>
        <div>
          <h5 className="text-xl mb-3">Teams</h5>
          <div className="space-y-2">
            {!isLoading && teams?.length === 0 && (
              <p className="text-gray-600">No teams found.</p>
            )}
            {isLoading && <p className="text-gray-600">Loading...</p>}
            {!isLoading && isFetching && (
              <p className="text-gray-600">Fetching...</p>
            )}
            {teams?.map((team: any) => (
              <TeamItem key={team._id} team={team} />
            ))}
          </div>
        </div>
      </div>
      <CreateTeamPopup
        isOpen={isCreateActive}
        onClose={() => setIsCreateActive(false)}
      />
    </div>
  );
}

const TeamItem = ({ team }: { team: Record<string, any> }) => {
  const router = useRouter();
  return (
    <div className="p-2 bg-gray-200 rounded-xl flex items-center gap-3 justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl w-fit bg-blue-300">
          <UsersRound size={25} className="text-blue-500" />
        </div>
        <div>
          <h5 className="text-md font-semibold">{team?.title}</h5>
        </div>
      </div>
      <div>
        <Button
          variant="success"
          onClick={() => router.push(`/admin/team/${team?._id}`)}
        >
          <Pencil size={15} />
          Edit team
        </Button>
      </div>
    </div>
  );
};

const CreateTeamPopup = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [teamType, setTeamType] = useState("");
  const [createTeam, { isLoading: isTeamCreating }] = useCreateTeamMutation();
  const handleCreateTeam = async () => {
    try {
      if (!teamName.trim() || !teamType) return;
      await createTeam({ teamName, teamType }).then((res) => {
        const teamId = res.data?.data?.teamId;
        if (teamId) router.push(`/admin/team/${teamId}`);
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

  return (
    <PopupBox
      openState={isOpen}
      onClose={onClose}
      className="space-y-6 w-[30em]"
    >
      <h5 className="text-md font-semibold">Create new Team</h5>
      <div className="space-y-3">
        <div>
          <Input
            placeholder="Enter team name"
            onChange={(e) => setTeamName(e)}
            disabled={isTeamCreating}
          />
        </div>
        <div>
          <Select
            options={["student", "faculty", "alumni"]}
            placeholder="Select team type"
            value={teamType}
            onChange={(e) => setTeamType(e)}
            disabled={isTeamCreating}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isTeamCreating}>
          Close
        </Button>
        <Button onClick={handleCreateTeam} disabled={isTeamCreating}>
          Create team
        </Button>
      </div>
    </PopupBox>
  );
};
