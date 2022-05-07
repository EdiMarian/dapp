import * as React from "react";

const Leaderboard = (props) => (
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 300 300"
    enableBackground="new 0 0 300 300"
    xmlSpace="preserve"
    {...props}
  >
    <image
      id="image0"
      width={300}
      height={300}
      x={0}
      y={0}
      href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAClFBMVEX////2vjv2vjv2vjv2 vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2 vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2 vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2 vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2 vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2 vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2 vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2 vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2 vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2 vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv2vjv///////////////// /////////v3//v3///7//////////////v3//vz///////////7/////////+/T///////7//v3/ //7//vv//fr//v32vjv///7///+hajGMAAAA2XRSTlMAAAEFHT1JS1BRTUpOT1I+HiqS3iwDW+bo YgT9VBwCcwncEhEUFxYaE/v5ypt0XlhfidP317BtM4PtxZpVHwd3uXAVCrriWQ4bQyPxf+Ta2cwY MutvEA1XoJGo9ZUZlJggnZeeC4jH1dFjgghEZPOPBrc7so7gOQw4Xb5hbKIvNCmA7z+0MXxmq0aj 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"
    />
  </svg>
);

export default Leaderboard;
