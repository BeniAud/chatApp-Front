import React from "react";
import { GiftedChat, MessageText } from "react-native-gifted-chat";
import axios from "axios";
import { View, Text } from "react-native";
class App extends React.Component {
  state = {
    messages: []
  };

  componentDidMount() {
    // rappel de la discussion
    axios
      .get("http://localhost:5001/messages/5c0ba0af3b9cb808aca9bda6")
      .then(reponse => {
        this.setState({ messages: reponse.data });
      });
    this.ws = new WebSocket("ws://localhost:5001");

    this.ws.onmessage = e => {
      const message = JSON.parse(e.data);

      this.setState({
        messages: GiftedChat.append(this.state.messages, message)
      });
    };
  }

  onSend(messages = []) {
    this.ws.send(
      JSON.stringify({
        text: messages[0].text,
        name: "Audrey", //fullName
        username: "audrey",
        theard: "5c0ba0af3b9cb808aca9bda6" //id de la discussion pour savoir cote back à qui appartient ce message
      })
    );
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <GiftedChat
        //id du User -b qui recois
        user={{ _id: "5c0a8dd679f520e0c4c78adf" }}
        renderMessageText={props => {
          console.log(props.currentMessage);
          if (
            props.currentMessage.isRequest === true &&
            props.currentMessage.thread.bike.user === "5c0a8dd679f520e0c4c78adf" //User -b Est-ce que je suis le propriétaire du vélo ?
          ) {
            return (
              //la demande de location avec l'acceptation ou le refus
              <React.Fragment>
                <MessageText {...props} />
                <View>
                  <Text>Vélo à louer</Text>
                </View>
              </React.Fragment>
            );
          } else {
            return (
              //sinon retourne le message
              <React.Fragment>
                <MessageText {...props} />
              </React.Fragment>
            );
          }
        }}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
      />
    );
  }
}

export default App;
