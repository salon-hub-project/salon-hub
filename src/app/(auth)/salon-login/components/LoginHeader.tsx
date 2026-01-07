import Icon from "../../../components/AppIcon";

const LoginHeader = () => {
  return (
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-lg bg-primary">
        <Icon name="LogIn" size={32} className="text-white" />
      </div>

      <h1 className="text-2xl font-semibold text-foreground">
        Welcome Back
      </h1>
      <p className="text-muted-foreground">
        Login to manage your salon
      </p>
    </div>
  );
};

export default LoginHeader;
