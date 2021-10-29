import logo from "./logo.svg";
import "./App.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Box from "@mui/material/Box";
import * as Yup from "yup";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const dishesApiUrl = "https://frosty-wood-6558.getsandbox.com:443/dishes";

function App() {
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(1, "Must be at least 1 character")
      .required("Required"),
    preparation_time: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
    no_of_slices: Yup.number().when("type", {
      is: "pizza",
      then: Yup.number().required("Required"),
    }),
    diameter: Yup.number().when("type", {
      is: "pizza",
      then: Yup.number().required("Required"),
    }),
    spiciness_scale: Yup.number().when("type", {
      is: "soup",
      then: Yup.number().required("Required"),
    }),
    slices_of_bread: Yup.number().when("type", {
      is: "sandwich",
      then: Yup.number().required("Required"),
    }),
  });

  const initialValues = {
    name: "",
    preparation_time: "00:00:00",
    type: "pizza",
    no_of_slices: 1,
    diameter: 10.0,
    spiciness_scale: 1,
    slices_of_bread: 1,
  };

  const prepareData = (data) => {
    if (data.type === "pizza") {
      const {
        spiciness_scale: removed1,
        slices_of_bread: removed2,
        ...rest
      } = data;
      return rest;
    } else if (data.type === "soup") {
      const {
        no_of_slices: removed1,
        diameter: removed2,
        slices_of_bread: removed3,
        ...rest
      } = data;
      return rest;
    } else if (data.type === "sandwich") {
      const {
        spiciness_scale: removed1,
        diameter: removed2,
        no_of_slices: removed3,
        ...rest
      } = data;
      return rest;
    }
    return data;
  };

  const postDishes = async (data, setErrors) => {
    const preparedData = prepareData(data);

    await fetch(dishesApiUrl, {
      method: "POST",
      body: JSON.stringify(preparedData),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        alert("All good, dish submitted!");

        return response;
      })
      .catch(async (response) => {
        const errors = await response.json();
        setErrors(errors);
      });
  };

  const onSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(false);
    postDishes(values, setErrors);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values }) => (
              <Form>
                <Box marginBottom={2}>
                  <Field name="name">
                    {({ field }) => (
                      <TextField
                        {...field}
                        id="name"
                        label="Dish name"
                        fullWidth
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="name"
                    className="App-error"
                    component="div"
                  />
                </Box>
                <Box marginBottom={2}>
                  <Field name="preparation_time">
                    {({ field }) => (
                      <TextField
                        {...field}
                        id="preparation_time"
                        name="preparation_time"
                        label="Preparation time"
                        type="time"
                        fullWidth
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="preparation_time"
                    className="App-error"
                    component="div"
                  />
                </Box>
                <Box marginBottom={2}>
                  <Field name="type">
                    {({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="typeLabel">Type</InputLabel>
                        <Select
                          {...field}
                          id="type"
                          label="Type"
                          labelId="typeLabel"
                          fullWidth
                        >
                          <MenuItem value="pizza">Pizza</MenuItem>
                          <MenuItem value="soup">Soup</MenuItem>
                          <MenuItem value="sandwich">Sandwich</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                  <ErrorMessage
                    name="type"
                    className="App-error"
                    component="div"
                  />
                </Box>

                {values.type === "pizza" && (
                  <>
                    <Box marginBottom={2}>
                      <Field name="no_of_slices">
                        {({ field }) => (
                          <TextField
                            {...field}
                            id="no_of_slices"
                            name="no_of_slices"
                            label="# of slices"
                            type="number"
                            fullWidth
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="no_of_slices"
                        className="App-error"
                        component="div"
                      />
                    </Box>
                    <Box marginBottom={2}>
                      <Field name="diameter">
                        {({ field }) => (
                          <TextField
                            {...field}
                            id="diameter"
                            name="diameter"
                            label="Diameter"
                            type="number"
                            inputProps={{ step: "0.1" }}
                            fullWidth
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="diameter"
                        className="App-error"
                        component="div"
                      />
                    </Box>
                  </>
                )}

                {values.type === "soup" && (
                  <Box marginBottom={2}>
                    <Field name="spiciness_scale">
                      {({ field }) => (
                        <TextField
                          {...field}
                          id="spiciness_scale"
                          name="spiciness_scale"
                          label="Spiciness Level"
                          type="number"
                          inputProps={{ min: "0", max: "10", step: "1" }}
                          fullWidth
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="spiciness_scale"
                      className="App-error"
                      component="div"
                    />
                  </Box>
                )}

                {values.type === "sandwich" && (
                  <Box marginBottom={2}>
                    <Field name="slices_of_bread">
                      {({ field }) => (
                        <TextField
                          {...field}
                          id="slices_of_bread"
                          name="slices_of_bread"
                          label="Slices of bread"
                          type="number"
                          fullWidth
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="slices_of_bread"
                      className="App-error"
                      component="div"
                    />
                  </Box>
                )}

                <Button
                  type="submit"
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </header>
    </div>
  );
}

export default App;
