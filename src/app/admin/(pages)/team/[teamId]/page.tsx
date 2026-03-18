"use client";

import { useGetMemberListQuery, useGetTeamByIdQuery } from '@/app/admin/features/team/teamApi';
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select';
import axios from 'axios';
import { Pencil, Plus } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function TeamEditPage() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const teamId = params.teamId;


    // fetch team
    const { data: teamData } = useGetTeamByIdQuery(teamId, {
        refetchOnMountOrArgChange: false
    });
    const teamDataInfo = teamData?.data ?? {};

    const [isTeamUpdating, setIsTeamUpdating] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [teamType, setTeamType] = useState("");

    useEffect(() => {
        if (teamData?.data) {
            setTeamName(teamData?.data.title)
            setTeamType(teamData?.data.teamType)
        }
    }, [teamData])

    // useEffect(() => {
    //     (async () => {
    //         if (!teamId) return;
    //         try {
    //             await axios.get(`/api/team/get?id=${teamId}`)
    //                 .then(res => {
    //                     const data = res.data.data;
    //                     if (data) {
    //                         setTeamName(data?.title);
    //                         setTeamType(data?.teamType);
    //                     }
    //                 })
    //         } catch (error) {

    //         }
    //     })();
    // }, [teamId]);


    // update team details
    const handleTeamUpdate = async () => {
        try {
            if (!(teamName.trim()) || !teamType || !teamId) return;
            setIsTeamUpdating(true);
            await axios.patch("/api/team/update", { teamId, teamName, teamType })
                .then(res => {
                    toast.success("Team details updated.")
                })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
        setIsTeamUpdating(false);
    }

    const handleTeamRemove = async () => {
        try {
            setIsTeamUpdating(true);
            await axios.delete(`/api/team/remove?id=${teamId}`)
                .then(() => {
                    toast.success("Team removed successfully");
                    router.push("/admin/team");
                })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
        setIsTeamUpdating(false);
    }

    // get team member list
    const { isLoading, isFetching, data: memberData } = useGetMemberListQuery(teamId);
    const teamMembers = memberData?.data ?? [];
    // useEffect(() => {
    //     (async () => {
    //         try {
    //             if (!teamId) return;
    //             await axios.get(`/api/team/member/get-list?teamId=${teamId}`)
    //                 .then(res => {
    //                     const data = res.data.data;
    //                     setTeamMembers(data || []);
    //                 })
    //         } catch (error) {

    //         }
    //     })();
    // }, [teamId]);
   


    return (
        <div>
            <div className='mb-10'>
                <h5 className='text-2xl font-bold'>Edit Team</h5>
                <p className='text-sm text-gray-600'>Add, remove or edit team members.</p>
            </div>
            <div className='space-y-6'>
                <div>
                    <h5 className='mb-3'>Team Details</h5>
                    <div className='space-y-3 mb-6'>
                        <div>
                            <Input placeholder='Enter team name' onChange={e => setTeamName(e)} disabled={isTeamUpdating} value={teamName} />
                        </div>
                        <div>
                            <Select options={['student', 'faculty', 'alumni']} placeholder='Select team type' value={teamType} onChange={e => setTeamType(e)} disabled={isTeamUpdating} />
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <Button variant='success' disabled={isTeamUpdating} onClick={handleTeamUpdate}>
                            Save changes
                        </Button>
                        <Button className='bg-red-400' disabled={isTeamUpdating} onClick={handleTeamRemove}>
                            Delete team
                        </Button>
                    </div>
                </div>

                <div>
                    <div className='flex items-center justify-between mb-4'>
                        <h5 className='text-xl mb-4'>Members</h5>
                        <Button onClick={() => router.push(`${pathname}/member?tab=create`)}>
                            <Plus size={15} />
                            Add new member
                        </Button>
                    </div>
                    <div className='space-y-2'>
                        {!isFetching && !teamMembers?.length && (
                            <p className='text-gray-600'>No members found.</p>
                        )}
                        {isLoading && (
                            <p className='text-gray-600'>Loading...</p>
                        )}
                        {!isLoading && isFetching && (
                            <p className='text-gray-600'>Fetching...</p>
                        )}
                        {teamMembers?.map((member: any) => (
                            <div key={member?._id} className='flex items-center justify-between bg-gray-200 p-3 rounded-xl'>
                                <div className='flex items-center gap-3'>
                                    <Avatar src={member?.avatar} />
                                    <h5>{member?.name}</h5>
                                </div>
                                <div>
                                    <Button onClick={() => router.push(`/admin/team/${teamId}/member?tab=edit&id=${member?._id}`)}>
                                        <Pencil size={15} />
                                        Edit member
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
