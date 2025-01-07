import React, { useEffect, useState } from "react";

interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  about: string;
}

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    about: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const username = localStorage.getItem("username");

        if (!username) {
          throw new Error("Username is missing in localStorage.");
        }

        const response = await fetch(
          `http://localhost:5000/auth/profile?username=${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        const fetchedProfile = {
          username: data.user.username,
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
          location: data.user.location || "",
          about: data.user.about || "",
        };

        setProfile(fetchedProfile);
        localStorage.setItem("profile", JSON.stringify(fetchedProfile));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: profile.username,
          email: profile.email,
          location: profile.location,
          about: profile.about,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
      setIsEditing(false);
      localStorage.setItem("profile", JSON.stringify(profile));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="bg-white max-w-2xl mx-auto mt-10 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          User Profile
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Details and information about the user.
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {!isEditing ? (
            <>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {`${profile.firstName} ${profile.lastName}`}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.email || "Not provided"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.location || "Not provided"}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">About</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.about || "Not provided"}
                </dd>
              </div>
              <div className="px-4 py-3 sm:px-6 text-right">
                <button
                  className="px-4 py-2 text-white bg-[#6b2e2e] rounded hover:bg-[#634e27]"
                  onClick={() => setIsEditing(true)}
                    >
                        <span className="inline-flex">
                    <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="mr-2"
              >
                <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
              </svg>
              <span>Edit Profile</span>
              </span>
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500">
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  disabled
                  className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  disabled
                  className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500">
                  About
                </label>
                <textarea
                  value={profile.about}
                  onChange={(e) =>
                    setProfile({ ...profile, about: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-[#6b2e2e] rounded hover:bg-[#634e27]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </dl>
      </div>
    </div>
  );
};

export default UserProfilePage;
