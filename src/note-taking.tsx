import React, {useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './note-taking.css'
type noteTakingProps = {
    name: string;
    timestamp: string;
};

function NoteTaking({ name, timestamp }: noteTakingProps) {
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    console.log("Note taking is now running")
    return (
        <div className='draft-root'>
            <Editor editorState={editorState} onChange={setEditorState}/>
        </div>
    );
}


export default NoteTaking;