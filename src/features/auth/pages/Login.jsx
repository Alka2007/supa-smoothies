import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthHero from "../components/AuthHero";
import { useAuth } from "../../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notice = location.state?.notice;

  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (values) => {
    setFormError(null);
    setIsSubmitting(true);

    try {
      await signIn({
        email: values.email.trim(),
        password: values.password,
      });

      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error(error);
      setFormError(error.message || "Could not sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-shell">
        <AuthHero
          title="Welcome back to your smoothie studio."
          subtitle="Sign in to manage recipes, update your collection, and keep your dashboard protected."
        />

        <div className="auth-panel auth-panel--form">
          <p className="eyebrow">Login</p>
          <h2>Sign in</h2>
          <p className="auth-copy">
            Use your Supabase email and password to continue.
          </p>

          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email." },
                { type: "email", message: "Please enter a valid email." },
              ]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password." },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              block
            >
              Sign in
            </Button>
          </Form>

          {notice ? (
            <Alert
              className="auth-alert"
              message={notice}
              type="success"
              showIcon
            />
          ) : null}

          {formError ? (
            <Alert
              className="auth-alert"
              message={formError}
              type="error"
              showIcon
            />
          ) : null}

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
