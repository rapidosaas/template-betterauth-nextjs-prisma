"use client";

import LogoutButton from "@/components/LogoutButton";

type UserProps = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | undefined | null;
};

export default function UserProfile({ user }: { user: UserProps }) {
  return (
    <div className="flex items-center gap-5 p-4 bg-gray-800 rounded-md shadow-md">
      <div className="flex items-center gap-3">
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-100">{user.name}</p>
          <p className="text-xs font-medium text-red-500">{user.email}</p>
        </div>
      </div>
      <LogoutButton /> {/* ✅ Intégration du bouton Logout */}
    </div>
  );
}
