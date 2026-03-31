import { useState } from "react";
import { Alert, Button, Form, Input, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";

const { TextArea } = Input;

const Create = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    if (!user?.id) {
      setFormError("You need to be signed in to create a recipe.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const { error } = await supabase.from("recepies").insert([
      {
        title: values.title.trim(),
        method: values.method.trim(),
        rating: values.rating,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.log(error);
      setFormError("Could not create the smoothie recipe. Please try again.");
      setIsSubmitting(false);
      return;
    }

    form.resetFields();
    setIsSubmitting(false);
    navigate("/");
  };

  return (
    <div className="page recipe-editor-page">
      <section className="recipe-editor-shell">
        <div className="recipe-editor-panel recipe-editor-panel--hero">
          <p className="eyebrow">Create recipe</p>
          <h1>Craft a smoothie worth saving.</h1>
          <p className="recipe-editor-copy">
            Add a standout title, describe the method clearly, and give it a
            rating so your board stays organized and easy to scan later.
          </p>

          <div className="recipe-editor-highlights">
            <div>
              <strong>Title with personality</strong>
              <span>Give each recipe a name that feels memorable at a glance.</span>
            </div>
            <div>
              <strong>Method that helps</strong>
              <span>Keep the steps simple so you can recreate it anytime.</span>
            </div>
            <div>
              <strong>Quick rating</strong>
              <span>Score each blend from 1 to 10 to find your favorites fast.</span>
            </div>
          </div>
        </div>

        <div className="recipe-editor-panel recipe-editor-panel--form">
          <div className="recipe-editor-panel__header">
            <p className="eyebrow">New smoothie</p>
            <h2>Create Smoothie Recipe</h2>
            <p>Fill in the details below and add your recipe to the dashboard.</p>
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
                Create Smoothie Recipe
              </Button>
            </Form.Item>

            {formError ? <Alert message={formError} type="error" showIcon /> : null}
          </Form>
        </div>
      </section>
    </div>
  );
};

export default Create;
  
