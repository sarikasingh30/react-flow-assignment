import React from "react";
import "./Custom.css";
import { Handle, Position } from "reactflow";
import { AiOutlineMessage } from "react-icons/ai";
import { RiWhatsappFill } from "react-icons/ri";
const TextNode = ({ data }) => {
  return (
    <div className="text-node">
      <div className="customMain">
        <div className="fixedCustom">
          <AiOutlineMessage />
          <p>Send Message</p>
          <RiWhatsappFill fill="#6bca7f" stroke="#6bca7f" />
        </div>
        <div>
          <p>{data.text || "Text Message"}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default TextNode;
