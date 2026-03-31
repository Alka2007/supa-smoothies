import { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, InputNumber } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";

const { TextArea } = Input;

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSmoothie = async () => {
      try {
        const { data, error } = await supabase
          .from("recepies")
          .select()
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          form.setFieldsValue({
            title: data.title,
            method: data.method,
            rating: data.rating,
          });
        }
      } catch (error) {
        console.log(error);
        navigate("/", { replace: true });
      }
    };

    if (!user?.id) {
      return;
    }

    fetchSmoothie();
  }, [form, id, navigate, user?.id]);

  const handleSubmit = async (values) => {
    if (!user?.id) {
      setFormError("You need to be signed in to update a recipe.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("recepies")
        .update({
          title: values.title.trim(),
          method: values.method.trim(),
          rating: values.rating,
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        setFormError(
          "You do not have permission to update this smoothie, or it no longer exists."
        );
        return;
      }

      navigate("/");
    } catch (error) {
      console.log(error);
      setFormError("Could not update the smoothie recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page recipe-editor-page">
      <button
        type="button"
        className="back-link back-link--button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftOutlined />
        <span>Back</span>
      </button>

      <section className="recipe-editor-shell">
        <div className="recipe-editor-panel recipe-editor-panel--hero recipe-editor-panel--hero-update">
          <p className="eyebrow">Update recipe</p>
          <h1>Refine the blend until it feels just right.</h1>
          <p className="recipe-editor-copy">
            Tweak the title, sharpen the method, or adjust the rating to keep
            your smoothie board current and useful.
          </p>

          <div className="recipe-editor-highlights">
            <div>
              <strong>Refresh the details</strong>
              <span>Polish the recipe so it stays clear the next time you revisit it.</span>
            </div>
            <div>
              <strong>Improve the method</strong>
              <span>Clarify ingredients, flow, or shortcuts you have learned.</span>
            </div>
            <div>
              <strong>Re-rate the result</strong>
              <span>Update the score as your recipe evolves over time.</span>
            </div>
          </div>
        </div>

        <div className="recipe-editor-panel recipe-editor-panel--form">
          <div className="recipe-editor-panel__header">
            <p className="eyebrow">Edit smoothie</p>
            <h2>Update Smoothie Recipe</h2>
            <p>Make your changes below and save the improved version back to the board.</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            className="recipe-editor-form"
            requiredMark={false}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: "Please enter a title." },
                { whitespace: true, message: "Please enter a title." },
              ]}
            >
              <Input placeholder="e.g. Mango Blast" size="large" />
            </Form.Item>

            <Form.Item
              label="Method"
              name="method"
              rules={[
                { required: true, message: "Please enter the method." },
                { whitespace: true, message: "Please enter the method." },
              ]}
            >
              <TextArea
                rows={7}
                placeholder="Describe how to make this smoothie"
              />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Please add a rating." }]}
            >
              <InputNumber
                min={1}
                max={10}
                style={{ width: "100%" }}
                placeholder="Rate from 1 to 10"
                size="large"
              />
            </Form.Item>

            <Form.Item className="recipe-editor-form__actions">
              <Button type="primary" htmlType="submit" loading={isSubmitting} size="large">
                Update Smoothie Recipe
              </Button>
            </Form.Item>

            {formError ? <Alert message={formError} type="error" showIcon /> : null}
          </Form>
        </div>
      </section>
    </div>
  );
};

export default Update;
