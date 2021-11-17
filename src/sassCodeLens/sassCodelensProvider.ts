import * as vscode from 'vscode';
import * as path from 'path';
import tipCodeLens from './tipCodeLens';
import findVariables from '../utils/findSassVariables';
import getPath from '../utils/getPath';

function matchSassVariable(cssVariables: any, targetValue: string) {
	for (const key in cssVariables) {
		if (
			cssVariables[key].toLocaleLowerCase() ===
			targetValue.toLocaleLowerCase()
		) {
			return key;
		}
	}
}

export class CodelensProvider implements vscode.CodeLensProvider {
	private codeLenses: vscode.CodeLens[] = [];
	private regex: RegExp;
	private _onDidChangeCodeLenses: vscode.EventEmitter<void> =
		new vscode.EventEmitter<void>();
	public readonly onDidChangeCodeLenses: vscode.Event<void> =
		this._onDidChangeCodeLenses.event;

	constructor() {
		this.regex = /.:[\s]*([^:\s;]+)/g;

		vscode.workspace.onDidChangeConfiguration((_) => {
			this._onDidChangeCodeLenses.fire();
		});
	}

	public provideCodeLenses = async (
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	) => {
		this.codeLenses = [];
		const regex = new RegExp(this.regex);
		const text = document.getText();
		const cssVariablesPath = await getPath.getSassVariablesPath();
		let matches, matchedAlias;

		if (cssVariablesPath === '') {
			return [];
		}

		const cssVariables = Object.assign({}, findVariables(cssVariablesPath));
		while ((matches = regex.exec(text)) !== null) {
			matchedAlias = matchSassVariable(cssVariables, matches[1]);
			if (matchedAlias) {
				const line = document.lineAt(
					document.positionAt(matches.index).line
				);
				const indexOf = line.text.indexOf(matches[1]);
				const position = new vscode.Position(line.lineNumber, indexOf);
				const range = document.getWordRangeAtPosition(
					position,
					new RegExp(/([^:\s;]+)/g)
				);
				if (range) {
					this.codeLenses.push(
						new tipCodeLens(
							document.fileName,
							range,
							matchedAlias,
							matches[1]
						)
					);
				}
			}
		}
		return this.codeLenses;
	};

	public resolveCodeLens(
		codeLens: vscode.CodeLens,
		token: vscode.CancellationToken
	) {
		return null;
	}
}
