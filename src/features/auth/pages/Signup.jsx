import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthHero from "../components/AuthHero";
import { useAuth } from "../../../hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setFormError(null);
    setIsSubmitting(true);

    try {
      const data = await signUp({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      const hasSession = Boolean(data.session);

      navigate(hasSession ? "/" : "/login", {
        replace: true,
        state: hasSession
          ? undefined
          : {
              notice:
                "Account created. If email confirmation is enabled, verify your email before logging in.",
            },
      });
    } catch (error) {
      console.error(error);
      setFormError(error.message || "Could not create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-shell">
        <AuthHero
          title="Create a home for every blend."
          subtitle="Sign up with Supabase auth, and a database trigger will create your `users` profile automatically."
        />

        <div className="auth-panel auth-panel--form">
          <p className="eyebrow">Signup</p>
          <h2>Create account</h2>
          <p className="auth-copy">
            Pick a name, create your credentials, and start building your recipe
            board.
          </p>

          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label="Full name"
              name="fullName"
              rules={[
                { required: true, message: "Please enter your full name." },
                { whitespace: true, message: "Please enter your full name." },
              ]}
            >
              <Input placeholder="Jamie Smooth" />
            </Form.Item>

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
                { required: true, message: "Please create a password." },
                { min: 6, message: "Password must be at least 6 characters." },
              ]}
            >
              <Input.Password placeholder="Create a password" />
            </Form.Item>

            <Form.Item
              label="Confirm password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password." },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error("Passwords do not match."));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              block
            >
              Create account
            </Button>
          </Form>

          {formError ? (
            <Alert
              className="auth-alert"
              message={formError}
              type="error"
              showIcon
            />
          ) : null}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
