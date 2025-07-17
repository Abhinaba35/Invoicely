import { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";
import { Navbar } from "../components/navbar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfilePage = () => {
    const [userDetails, setUserDetails] = useState({});
    const [loadingProfile, setLoadingProfile] = useState(false);

    const getUserDetails = async () => {
        try {
            setLoadingProfile(true);
            const resp = await axiosInstance.get("/users/details");
            setUserDetails(resp.data.data.user);
        } catch (err) {
            ErrorToast(`${err.response?.data?.message || err.message}`);
        } finally {
            setTimeout(() => setLoadingProfile(false), 5000);
        }
    };

    const handleUpdateUserDetails = (e) => {
        e.preventDefault();
        //...
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
            <Navbar />
            <div className="flex justify-center items-center py-10">
                {loadingProfile ? (
                    <div className="py-10 flex items-center justify-center">
                        <SkeletonTheme baseColor="#808080" highlightColor="#444">
                            <div className="bg-gray-200 rounded-2xl p-4 shadow-md w-full max-w-sm">
                                {/* Image Placeholder */}
                                <Skeleton height={180} className="rounded-xl mb-4" />

                                {/* Title Placeholder */}
                                <Skeleton height={20} width={`80%`} className="mb-2" />

                                {/* Subtitle/Description Placeholder */}
                                <Skeleton height={15} width={`60%`} className="mb-4" />

                                {/* Button or Footer Placeholder */}
                                <div className="flex justify-between items-center mt-4">
                                    <Skeleton height={30} width={80} />
                                    <Skeleton circle={true} height={30} width={30} />
                                </div>
                            </div>
                        </SkeletonTheme>
                    </div>
                ) : (
                    <form className="flex flex-col p-8 gap-6 bg-white rounded-2xl shadow-2xl border border-indigo-100 w-full max-w-lg" onSubmit={handleUpdateUserDetails}>
                        <h1 className="text-3xl font-extrabold text-indigo-700 mb-4 text-center tracking-tight drop-shadow">Profile Page</h1>
                        <div className="flex flex-col items-center mb-4">
                            <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-300 mb-2">
                                <img src={userDetails.image || ""} alt="Profile" className="object-cover w-full h-full" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                defaultValue={userDetails.email}
                                type="text"
                                name="email"
                                className="py-2 px-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed w-full text-gray-500"
                                disabled
                            />
                        </div>
                        <p className="px-2 py-1 border rounded-md bg-lime-200 text-sm w-fit font-semibold uppercase tracking-wide">{userDetails.role}</p>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Name</label>
                            <input
                                defaultValue={userDetails.name}
                                type="text"
                                name="name"
                                className="py-2 px-3 border border-indigo-200 rounded-md w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Gender</label>
                            <select
                                defaultValue={userDetails.gender || "not-allowed"}
                                name="gender"
                                className="py-2 px-3 border border-indigo-200 rounded-md w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                            >
                                <option value="not-allowed">---select---</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition font-semibold text-lg">Update Profile</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export { ProfilePage };

