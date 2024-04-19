import React from 'react';
import { VscGitPullRequestCreate } from "react-icons/vsc";
const CreateNodeButton = ({ onClick }) => {
  return (
    <button onClick={onClick}><VscGitPullRequestCreate/></button>
  );
};

export default CreateNodeButton;
