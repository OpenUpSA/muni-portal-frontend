import { BasicBlock } from "../basic-block";

export const ProfileInfo = (profile) => {
  const accountSettingsSections = [];
  accountSettingsSections.push(
    new BasicBlock({
      title: "Username",
      subtitle: profile.username,
    })
  );
  accountSettingsSections.push(
    new BasicBlock({
      title: "Email address",
      subtitle: profile.email,
    })
  );
  return accountSettingsSections;
};
