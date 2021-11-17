import * as vscode from "vscode";

class getPath {
	public static async getSassVariablesPath() {
		const sassVariablesPathArr = await vscode.workspace.findFiles(
			vscode.workspace.getConfiguration().get("variable-replace-plugin.sassVariablesPath") as string
		);

		if (sassVariablesPathArr.length === 0) {
			return "";
		}

		const sassVariablesPath = sassVariablesPathArr[0].path.startsWith("/")
			? sassVariablesPathArr[0].path.substr(1)
			: sassVariablesPathArr[0].path;
		return sassVariablesPath;
	}
}

export default getPath;
