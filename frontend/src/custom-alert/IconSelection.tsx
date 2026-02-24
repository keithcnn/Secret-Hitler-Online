import React, { Component } from "react";
import "../selectable.css";
import "./IconSelection.css";
import portraits, {
  unlockedPortraits,
  lockedPortraits,
  defaultPortrait,
} from "../assets";
import { portraitsAltText } from "../assets";

import ButtonPrompt from "./ButtonPrompt";
import { SendWSCommand, WSCommandType } from "../types";

type IconSelectionProps = {
  playerToIcon: Record<string, string>;
  players: string[];
  sendWSCommand: SendWSCommand;
  user: string;
  onConfirm: () => void;
};

class IconSelection extends Component<IconSelectionProps> {
  isIconInUse(iconID: string) {
    let playerOrder = this.props.players;
    for (let i = 0; i < playerOrder.length; i++) {
      let player = playerOrder[i];
      if (this.props.playerToIcon[player] === iconID) {
        return true;
      }
    }
    return false;
  }

  onClickIcon(iconID: string) {
    // Does not allow selection if user has already selected this icon
    let unselectable = this.isIconInUse(iconID);

    if (!unselectable) {
      this.props.sendWSCommand({
        command: WSCommandType.SELECT_ICON,
        icon: iconID,
      });
    }
  }

  onConfirmButtonClick() {
    if (this.props.playerToIcon[this.props.user] !== defaultPortrait) {
      this.props.onConfirm();
    }
  }

  getIconButtonHML(portraitNames: string[]): React.JSX.Element {
    let currPortrait = this.props.playerToIcon[this.props.user];

    const iconHTML: (React.JSX.Element | undefined)[] = portraitNames.map(
      (portraitID, index: number) => {
        if (!portraits[portraitID]) {
          return undefined;
        }
        let isIconAvailable =
          !this.isIconInUse(portraitID) || portraitID === currPortrait;
        let isSelected = currPortrait === portraitID;

        return (
          <img
            id={"icon"}
            key={index}
            className={
              "selectable" +
              (isSelected ? " selected" : "") +
              (!isIconAvailable ? " disabled" : "")
            }
            alt={portraitsAltText[portraitID]}
            src={portraits[portraitID]}
            draggable={false}
            onClick={() => this.onClickIcon(portraitID)}
          ></img>
        );
      }
    );

    return <div id={"icon-container"}>{iconHTML}</div>;
  }

  render() {
    const portraitsToShow = unlockedPortraits.concat(lockedPortraits);

    return (
      <ButtonPrompt
        label={"PLAYER LOOK"}
        renderHeader={() => {
          return (
            <>
              <p>Choose a look, then press confirm.</p>
              {this.getIconButtonHML(portraitsToShow)}
            </>
          );
        }}
        renderFooter={() => {
          return (
            <div id={"locked-icon-text-container"}>
              <p>({lockedPortraits.length} extra icons are enabled by default.)</p>
            </div>
          );
        }}
        buttonDisabled={
          this.props.playerToIcon[this.props.user] === defaultPortrait
        }
        buttonOnClick={this.onConfirmButtonClick.bind(this)}
      ></ButtonPrompt>
    );
  }
}

export default IconSelection;
