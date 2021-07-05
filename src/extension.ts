/* eslint-disable eqeqeq */
/* eslint-disable curly */
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Code-repeater is now active!');

	let custom = vscode.commands.registerCommand('code-repeater.custom', () => {
		vscode.window.showInputBox().then(data=>{
			console.log(data);
			if(data!==undefined){
				if(/^[0-9]+$/.test(data) && +data>0)
					start(+data);
				else
					vscode.window.showErrorMessage("Invalid property");
			}
		});
	});

	let disposable = vscode.commands.registerCommand('code-repeater.run', () => {
		start();
	});

	function start(delay: number = 20){
		const editor = vscode.window.activeTextEditor;
		let start = editor?.selection.start||new vscode.Position(0,0);
		let end = editor?.selection.end||new vscode.Position(0,0);
		if(start.character==end.character && start.line==end.line){
			vscode.window.showErrorMessage("Select text");
			return;
		}
		let selectedText : Array<string> = editor?.document.getText(new vscode.Range(start,end)).split("").filter(e=>e.charCodeAt(0)!=13)||[""];
		selectedText.forEach(e=>console.log(e.charCodeAt(0)));
		editor?.edit(editBuilder => editBuilder.delete(new vscode.Range(start,end)));
		setTimeout(()=>input(),1000);

		function input(){
			setTimeout(()=>{
				if(selectedText[0].charCodeAt(0)==10){
					selectedText.shift();
					let index = selectedText.findIndex(e=>e!=" ");
					selectedText = selectedText.slice(index);
					editor?.edit((editBuilder) => editBuilder.insert(editor.selection.active, String.fromCharCode(10) + " ".repeat(index)));
				}else
					editor?.edit((editBuilder) => editBuilder.insert(editor.selection.active, selectedText.shift()||""));
				if(selectedText.length)
					input();
			},delay);
		}
	}

	context.subscriptions.push(disposable);
	context.subscriptions.push(custom);
}

export function deactivate() {
	
}
