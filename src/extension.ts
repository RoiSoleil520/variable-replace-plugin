import * as vscode from "vscode";
import languages from './utils/languages';

import { CodelensProvider } from "./sassCodeLens/sassCodelensProvider";
import sassCompletion from "./sassVariablesCompletion";

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "variable-replace-plugin.cssVariableReplace" is now active!');

  sassCompletion(context);

  for (const lan of languages) {
    vscode.languages.registerCodeLensProvider(lan, new CodelensProvider());
  }

	let disposable = vscode.commands.registerCommand(
		"variable-replace-plugin.cssVariableReplace",
		(alias, value, fileName, range) => {
			const editor = vscode.window.activeTextEditor;
			editor?.edit(editBuilder => {
				editBuilder.replace(range, alias);
			});
		}
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
