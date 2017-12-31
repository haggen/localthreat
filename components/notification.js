export const Notification = ({ children }) => {
  if (!children[0]) return null;
  return (
    <div class="notification">
      <figure class="notification__icon">!</figure>
      <div class="notification__text">
        {children}
      </div>
    </div>
  );
};
