import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import SwitchSelector from "react-native-switch-selector";
import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";

import { PromptContext, savePrompt } from "../utils";
import { TimePicker } from "../components/timepicker.js";

export function PromptScreen({ navigation, route }) {
  const { setSavedPrompts } = React.useContext(PromptContext);

  const [promptObject, setPromptObject] = React.useState(null);
  const [promptText, setPromptText] = React.useState("");
  const [responseTypeOpen, setResponseTypeOpen] = React.useState(false);
  const [responseType, setResponseType] = React.useState(null);
  const [responseTypeItems, setResponseTypeItems] = React.useState([
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Yes/No", value: "yesno" },
    // { label: "Custom Options", value: "customOptions" },
  ]);
  const [notificationFrequencyOpen, setNotificationFrequencyOpen] =
    React.useState(false);
  const [notificationFrequencyUnit, setNotificationFrequencyUnit] =
    React.useState(null);
  const [notificationFrequencyValue, setNotificationFrequencyValue] =
    React.useState(null);
  const [notificationFrequencyItems, setNotificationFrequencyItems] =
    React.useState([
      { label: "Days", value: "days" },
      { label: "Hours", value: "hours" },
      { label: "Minutes", value: "minutes" },
    ]);

  // set the prompt object if it was passed in (this is for editing)
  React.useEffect(() => {
    if (route.params && route.params.prompt) {
      setPromptObject(route.params.prompt);
      setPromptText(route.params.prompt.promptText);
      setResponseType(route.params.prompt.responseType);
      setNotificationFrequencyUnit(
        route.params.prompt.notificationFrequency.unit
      );
      setNotificationFrequencyValue(
        route.params.prompt.notificationFrequency.value
      );
    }
  }, [route.params]);

  // TODO: add a way to add custom options

  const onResponseTypeOpen = React.useCallback(() => {
    setNotificationFrequencyOpen(false);
  }, []);

  const onNotificationFrequencyOpen = React.useCallback(() => {
    setResponseTypeOpen(false);
  }, []);

  const [silencePrompt, setSilencePrompt] = React.useState(false);
  const silencePromptOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  return (
    <View style={styles.container}>
      <>
        <Text>
          Think of something that interests you and write a question about it.
          {"\n\n"}E.g: "Are you feeling energetic?", "Have you had a meal?"
        </Text>
      </>

      <View style={styles.formSection} zIndex={10000}>
        <View style={styles.formComponent}>
          <Text>Prompt Text</Text>
          <TextInput
            multiline
            placeholder="e.g How are you feeling about work?"
            style={styles.input}
            value={promptText}
            onChangeText={setPromptText}
          />
        </View>

        <View style={styles.formComponent}>
          <Text>Response Type</Text>
          {/* select button */}
          <DropDownPicker
            open={responseTypeOpen}
            value={responseType}
            items={responseTypeItems}
            setOpen={setResponseTypeOpen}
            onOpen={onResponseTypeOpen}
            placeholder="Select Response Type"
            setValue={setResponseType}
            setItems={setResponseTypeItems}
          />
        </View>

        <View style={styles.formComponent}>
          <Text>How often do you want to be prompted?</Text>
          {/* select drop down */}
          {/* the other part should be the unit  - days, hours, minutes */}
          {/* allow configure based on number of */}
          <View style={styles.frequencyContainer}>
            <TextInput
              inputMode="numeric"
              keyboardType="numeric"
              placeholder="8"
              style={styles.frequencyValueInput}
              value={notificationFrequencyValue}
              onChangeText={setNotificationFrequencyValue}
            />
            <DropDownPicker
              open={notificationFrequencyOpen}
              value={notificationFrequencyUnit}
              items={notificationFrequencyItems}
              setOpen={setNotificationFrequencyOpen}
              onOpen={onNotificationFrequencyOpen}
              placeholder="Set Frequency"
              setValue={setNotificationFrequencyUnit}
              setItems={setNotificationFrequencyItems}
              containerStyle={styles.frequencyDropDown}
            />
          </View>
        </View>

        <View style={styles.formComponent}>
          <Text>Disable prompts at certain times of the day?</Text>
          <SwitchSelector
            initial={1}
            onPress={(value) => setSilencePrompt(value)}
            textColor="#ccceeaa"
            selectedColor="#7a44cf"
            buttonColor="#ccc"
            borderColor="#ccc"
            hasPadding
            options={silencePromptOptions}
          />

          {silencePrompt && <TimePicker styles={styles.formComponent} />}
        </View>
      </View>

      <View zIndex={2000}>
        <Button
          title="Save Prompt"
          onPress={async () => {
            try {
              // if there is a prompt object, then we are editing an existing prompt
              const promptUuid = promptObject ? promptObject.uuid : null;

              const res = await savePrompt(
                promptText,
                responseType,
                notificationFrequencyValue,
                notificationFrequencyUnit,
                promptUuid
              );

              if (res) {
                // update the saved prompts state
                setSavedPrompts(res);
                navigation.navigate("Home", {
                  prompts: res,
                });
              } else {
                Alert.alert("Error", "There was an error saving the prompt");
              }
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </View>

      {/* {!route.params?.prompt && (
        <View>
          <Text>Or, chose prompt from preset options</Text>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    padding: 10,
  },
  input: {
    height: 50,
    // margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    lineHeight: 25,
  },
  formSection: {
    width: "100%",
    padding: 10,
  },
  frequencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  frequencyValueInput: {
    width: "20%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  frequencyDropDown: {
    width: "80%",
  },
  item: {
    // padding: 10,
    // fontSize: 18,
    margin: 10,
  },
  formComponent: {
    marginTop: 10,
  },
});
