import * as vscode from 'vscode';
import findVariables from '../utils/findSassVariables';
import getPath from '../utils/getPath';
import languages from '../utils/languages';

const provideCompletionItems = async (
	document: vscode.TextDocument,
	position: vscode.Position
) => {
	const line = document.lineAt(position);
	const fileName = document.fileName;
	const cssVariablesPath = await getPath.getSassVariablesPath();

	if (line.text.indexOf(':') === -1 || cssVariablesPath === '') {
		return;
	}

	const variables = Object.assign({}, findVariables(cssVariablesPath));

	return Object.keys(variables).map((variable) => {
		const variableValue = variables[variable];

		const completionItem = new vscode.CompletionItem(
			variable,
			vscode.CompletionItemKind.Variable
		);

		completionItem.detail = variableValue;
		completionItem.filterText = `${variable}: ${variableValue};`;
		completionItem.documentation = `${variable}: ${variableValue};`;

		return completionItem;
	});
};

export default function sassCompletion(context: vscode.ExtensionContext) {
	for (const lan of languages) {
		context.subscriptions.push(
			vscode.languages.registerCompletionItemProvider(
				lan,
				{ provideCompletionItems },
				'#'
			)
		);
	}
}
