"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { updateCurrentUserProfile } from "@/app/actions";
import { ObjectBox, StyledButton, StyledInput } from "@/components/StyledBits";

const ProfileBox = styled(ObjectBox)`
  width: min(100%, 440px);
  box-sizing: border-box;
`;

const ProfileForm = styled.form`
  display: grid;
  gap: 4px;

  label {
    font-weight: 600;
  }
`;

const EditProfile = ({
  username: initialUsername,
  name: initialName,
}: {
  username: string;
  name: string;
}) => {
  const router = useRouter();
  const [username, setUsername] = useState(initialUsername);
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const result = await updateCurrentUserProfile({ username, name });
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setUsername(result.profile.username);
      setName(result.profile.name);
      setMessage("Profile updated.");
      router.refresh();
    } catch {
      setError("Could not update your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProfileBox>
      <h2>Edit profile</h2>
      <ProfileForm onSubmit={saveProfile}>
        <label htmlFor="profile-username">Username</label>
        <StyledInput
          id="profile-username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <label htmlFor="profile-name">Name</label>
        <StyledInput
          id="profile-name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <StyledButton type="submit" $btnclr="green" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save profile"}
        </StyledButton>
        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}
      </ProfileForm>
    </ProfileBox>
  );
};

export { EditProfile };
