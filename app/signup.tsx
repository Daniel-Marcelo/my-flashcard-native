import { useForm, useController } from "react-hook-form";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type FormFieldProps = {
  name: keyof FormData;
  label: string;
  control: any;
  rules?: any;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoComplete?: "email" | "password" | "off";
};

const FormField = ({
  name,
  label,
  control,
  rules,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoComplete = "off",
}: FormFieldProps) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <ThemedView style={styles.inputContainer}>
      <ThemedText>{label}</ThemedText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoComplete={autoComplete}
      />
      {error && <ThemedText style={styles.error}>{error.message}</ThemedText>}
    </ThemedView>
  );
};

const SignUpScreen = () => {
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = (data: FormData) => {
    // TODO: Implement actual sign-up logic here
    console.log("Sign up with:", data);
    router.replace("/");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Sign Up
      </ThemedText>

      <ThemedView style={styles.form}>
        <FormField
          name="email"
          label="Email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email address",
            },
          }}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoComplete="email"
        />

        <FormField
          name="password"
          label="Password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          placeholder="Enter your password"
          secureTextEntry
          autoComplete="password"
        />

        <FormField
          name="confirmPassword"
          label="Confirm Password"
          control={control}
          rules={{
            required: "Please confirm your password",
            validate: (value: string) =>
              value === password || "Passwords do not match",
          }}
          placeholder="Confirm your password"
          secureTextEntry
          autoComplete="password"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#0a7ea4",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
