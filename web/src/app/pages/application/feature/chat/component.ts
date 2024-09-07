import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-chat-room',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChatRoomComponent implements OnInit {
  
  username: string = "";
  roomKey: string = "";
  chatMsgs: string = '';
  currMsg: string = '';
  members: string[] = [];

  @ViewChild('chatTextArea')
  chatTextArea: any //ElementRef;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Ask the backend to create a new chat room and fetches the key to this room
   */
  createRoom() {
    
  }

  /**
   * Connect to the chat room
   */
  connectRoom() {
   
  }

  /**
   * Send a message
   */
  sendMsg() {
    
  }

  /**
   * Fetch room members
   */
  fetchMembers() {
   
  }

  /**
   * Scroll the textarea to its bottom
   */
  private scrollTextAreaToBtm() {
    let textArea: HTMLTextAreaElement = this.chatTextArea.nativeElement;
    textArea.scrollTop = textArea.scrollHeight;
  }
}