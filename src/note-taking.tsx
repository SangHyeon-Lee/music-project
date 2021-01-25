import React, {useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './note-taking.css'
import { Button } from 'antd';

type noteTakingProps = {
    name: string;
    timestamp: string;
};

//TODO
//1. 버튼 눌렀을 때 firebase에 저장
//      - plain text -> string , 일단은 plain으로?
//      - rich text -> 조금 다른 형태
//2. 

function NoteTaking({ name, timestamp }: noteTakingProps) {
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    console.log("Note taking is now running")
    return (
        <div className='draft-root'>
            <Editor editorState={editorState} onChange={setEditorState}/>
            <Button type="primary">Button</Button>
        </div>
    );
}


export default NoteTaking;