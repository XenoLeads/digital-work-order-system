function capitalizeString(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

const UserProfileCard = ({ session }) => {
  return (
    <div className="bg-neutral-800 rounded-sm p-4">
      {session ? (
        <p>
          Logged in as <strong>{capitalizeString(session.user.name)}</strong>
        </p>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default UserProfileCard;
