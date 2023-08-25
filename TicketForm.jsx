import clsx from "clsx";
import { ErrorMessage, Field } from "formik";
import { useState } from "react";
import { Form, Formik } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import nextConfig from "next.config";
import { submitLead } from "@/services-client/contact";
import { ticketValidation } from "./validations/validationSchemaTicket"; // Importa el nuevo esquema de validación

const formClasses =
  "block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm";

function Label({ id, children }) {
  return (
    <label
      htmlFor={id}
      className="mb-3 block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  );
}

export function TextField({
  id,
  label,
  type = "text",
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <Field id={id} type={type} {...props} className={formClasses} />
      <ErrorMessage
        name={id}
        component="div"
        className="mt-1 text-xs text-red-500"
      />
    </div>
  );
}

export function SelectField({ id, label, className = "", error, ...props }) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <Field
        as="select"
        id={id}
        {...props}
        className={clsx(formClasses, "pr-8")}
      />

      {/* Renderizado condicional del error */}
      {error && (
        <div className="col-span-full mt-1 text-xs text-red-500">{error}</div>
      )}
    </div>
  );
}

// ... (otro código que necesites)

export default function EnterpriseForm() {
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState(null);
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  return (
    <Formik
      initialValues={{
        need: "",
        email: "",
        fullName: "",
        title: "",
        message: "",
        platform: "",
      }}
      // Aquí puedes agregar la validación personalizada con Joi,
      // ya que la propiedad validationSchema está específicamente para Yup
      validate={(values) => {
        const { error } = ticketValidation.validate(values, {
          abortEarly: false,
        });
        return error
          ? error.details.reduce((acc, curr) => {
              acc[curr.path[0]] = curr.message;
              return acc;
            }, {})
          : {};
      }}
      onSubmit={async (values, { setSubmitting }) => {
        if (recaptchaValue) {
          try {
            const successData = await submitLead(values, recaptchaValue);
            console.log("Lead registered successfully:", successData);
            // Handle success, perhaps navigate to another page or show a success message
          } catch (error) {
            setErrors({ api: error.message });
          }
        }
        return false;
      }}
      // ... (otros props y manejo del submit)
    >
      <Form noValidate action="#" className="mt-10">
        {/* Aquí debes poner tus propios componentes o código para mostrar las opciones en un selector */}
        <select
          name="need"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="" label="Selecciona lo que necesitas" />
          <option value="opcion1" label="Opción 1" />
          <option value="opcion2" label="Opción 2" />
        </select>

        <TextField
          id="email"
          type="email"
          label="Email Address"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <TextField
          id="fullName"
          label="Full Name"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <TextField
          id="title"
          label="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <TextField
          id="message"
          label="Message"
          as="textarea"
          rows={4}
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <SelectField
          id="platform"
          name="platform"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={errors["referralSource"]}
        >
          <option value="" label="Selecciona la plataforma" />
          <option value="iOS App" label="iOS App" />
          <option value="Android" label="Android" />
          <option value="Web" label="Web" />
        </SelectField>
        <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
          <div className="flex h-6 items-center">
            <Switch
              checked={agreed}
              onChange={setAgreed}
              className={classNames(
                agreed ? "bg-indigo-600" : "bg-gray-200",
                "flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              )}
            >
              <span className="sr-only">Agree to policies</span>
              <span
                aria-hidden="true"
                className={classNames(
                  agreed ? "translate-x-3.5" : "translate-x-0",
                  "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
          <Switch.Label className="text-sm leading-6 text-gray-600">
            By clicking on the form, you agree to our{" "}
            <a href="#" className="font-semibold text-[#00909E]">
              privacy policy
            </a>
            .
          </Switch.Label>
        </Switch.Group>
        <div className="flex mt-2 w-full items-center justify-center sm:col-span-2">
          <ReCAPTCHA
            sitekey={nextConfig.env.RECAPTCHA_SITE_KEY}
            onChange={(value) => setRecaptchaValue(value)}
          />
        </div>
        <div className="mt-2 flex items-center justify-center sm:col-span-2">
          <button
            disabled={!isButtonEnabled}
            type="submit"
            className={`block w-full max-w-sm rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isButtonEnabled
                ? "bg-[#142850] text-white hover:bg-[#00909E]"
                : "cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300"
            }`}
          >
            Create a ticket
          </button>
        </div>

        {/* ... (otros elementos del formulario como botones, switches, etc.) */}
      </Form>
    </Formik>
  );
}
