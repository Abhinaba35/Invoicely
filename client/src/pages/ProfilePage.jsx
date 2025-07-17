import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { Navbar } from "../components/navbar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdOutlineCloudUpload } from "react-icons/md";
import { SyncLoader } from "react-spinners";

const DUMMY_IMAGE =
    "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_719432-1351.jpg?semt=ais_hybrid&w=740";

const ProfilePage = () => {
    const [userDetails, setUserDetails] = useState({});
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const inputFileRef = useRef(null);
    const { setUser } = useAppContext();

    const getUserDetails = async () => {
        try {
            setLoadingProfile(true);
            const resp = await axiosInstance.get("/users/details");
            setUserDetails(resp.data.data.user);
            if (setUser) {
                setUser((prev) => ({ ...prev, ...resp.data.data.user }));
            }
        } catch (err) {
            ErrorToast(`${err.response?.data?.message || err.message}`);
        } finally {
            setTimeout(() => setLoadingProfile(false), 1000);
        }
    };

    const handleUpdateUserDetails = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const mobile = form.mobile.value;
        const gender = form.gender.value;
        try {
            setLoadingProfile(true);
            const resp = await axiosInstance.put("/users", { name, mobile, gender });
            SuccessToast("Profile updated!");
            setUserDetails(resp.data.data.user);
            if (setUser) {
                setUser((prev) => ({ ...prev, ...resp.data.data.user }));
            }
        } catch (err) {
            ErrorToast(`Update failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleDPUpload = async (e) => {
        try {
            setIsImageUploading(true);
            const formData = new FormData();
            formData.append("displayPicture", e.target.files[0]);
            const resp = await axiosInstance.put("/users/display-picture", formData);
            SuccessToast("Image Uploaded!");
            setUserDetails(resp.data.data.user);
            if (setUser) {
                setUser((prev) => ({ ...prev, ...resp.data.data.user }));
            }
        } catch (err) {
            ErrorToast(`Image upload failed: ${err.message}`);
        } finally {
            setIsImageUploading(false);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const handleDisplayPictureContainerClick = () => {
        inputFileRef.current.click();
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-300 via-white to-blue-200" >
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[90vh] w-full">
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
                    <>
                        <form className="flex flex-col p-8 gap-6 bg-white rounded-2xl shadow-lg border border-blue-100 max-w-lg w-full mx-auto mt-4" onSubmit={handleUpdateUserDetails}>
                            <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Profile Details</h2>

                            <div className="flex justify-center my-2">
                                <button
                                    type="button"
                                    className="relative flex items-center justify-center h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blue-200 to-blue-400 cursor-pointer hover:shadow-2xl transition-all focus:outline-none"
                                    onClick={handleDisplayPictureContainerClick}
                                    tabIndex={0}
                                    aria-label="Change profile picture"
                                >
                                    <img
                                        src={userDetails.imageUrl ? userDetails.imageUrl : DUMMY_IMAGE}
                                        className="object-cover h-full w-full"
                                        alt="Profile"
                                    />
                                    {isImageUploading ? (
                                        <SyncLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 border-yellow-400!" />
                                    ) : (
                                        <MdOutlineCloudUpload className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-amber-900 opacity-80" />
                                    )}
                                </button>
                                <input
                                    type="file"
                                    onChange={handleDPUpload}
                                    className="py-1 px-2 border-1 border-gray-400 rounded-md hidden"
                                    ref={inputFileRef}
                                    tabIndex={-1}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-700 font-medium" htmlFor="profile-email">Email</label>
                                <input
                                    id="profile-email"
                                    value={userDetails.email || ''}
                                    type="email"
                                    name="email"
                                    className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 bg-gray-100 cursor-not-allowed focus:outline-none"
                                    disabled
                                />
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-700 font-medium" htmlFor="profile-name">Name</label>
                                <input
                                    id="profile-name"
                                    type="text"
                                    name="name"
                                    defaultValue={userDetails.name || ''}
                                    className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-700 font-medium" htmlFor="profile-mobile">Mobile Number</label>
                                <input
                                    id="profile-mobile"
                                    type="tel"
                                    name="mobile"
                                    defaultValue={userDetails.mobile || ''}
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-700 font-medium" htmlFor="profile-gender">Gender</label>
                                <select
                                    id="profile-gender"
                                    name="gender"
                                    defaultValue={userDetails.gender || ''}
                                    className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow transition mt-2">Update Profile</button>
                        </form>
                       
                    </>
                )}
                <div></div>
            </div>
        </div>
    );
};

export { ProfilePage };