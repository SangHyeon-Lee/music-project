import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

type noteTakingProps = {
  name: string;
  timestamp: string;
};

const NoteTaking = ({ name, timestamp }: noteTakingProps) => {


  return (

    <Editor
      apiKey="ooj1q470wqf1gic73zgpx0jtyqx19mvyj225lgatvd2cwbbh"

      init={{
        height: 300,
        placeholder: 'type your notes!',
        menubar: false,
        statusbar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen save',
          'insertdatetime media table paste code help wordcount'
        ],
        
        branding: false
        
      }}
      
    />
    
  );
}


export default NoteTaking;