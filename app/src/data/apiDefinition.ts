import { getDemoApi } from "@epam/uui-docs";
import type { IProcessRequest, CommonContexts, UuiContexts } from "@epam/uui";
import { ITablePreset } from "../demo/table/types";

export interface GetCodeParams {
    path: string;
}

export interface GetCodeResponse {
    filePath: string;
    gitUrl: string;
    raw: string;
    highlighted: string;
}

export function getApi(processRequest: IProcessRequest, origin: string = "") {
    return {
        demo: getDemoApi(processRequest, origin),
        success: {
            validateForm: <T>(formState: T) => processRequest(origin.concat("api/success/validate-form"), "POST", formState),
        },
        errors: {
            status: (status: number) => processRequest(origin.concat(`api/error/status/${ status }`), "POST"),
            setServerStatus: (status: number) => processRequest(origin.concat(`api//error/set-server-status/${ status }`), "POST"),
            mock: () => processRequest(origin.concat(`api//error/mock`), "GET"),
            authLost: () => processRequest(origin.concat(`api//error/auth-lost`), "POST"),
        },
        getChangelog(): Promise<any> {
            return processRequest(origin.concat("/api/get-changelog"), "GET");
        },
        getCode(rq: GetCodeParams): Promise<GetCodeResponse> {
            return processRequest(origin.concat(`/api/get-code`), "POST", rq);
        },
        getProps(): Promise<any> {
            return processRequest(origin.concat(`/api/get-props/`), "GET");
        },
        presets: {
            getPresets(): Promise<ITablePreset[]> {
                return Promise.resolve(JSON.parse(localStorage.getItem("presets")) ?? []);
            },
            createPreset(preset: ITablePreset): Promise<number> {
                const presets = (JSON.parse(localStorage.getItem("presets")) ?? []) as ITablePreset[];
                const newId = presets.length
                    ? Math.max.apply(null, presets.map(p => p.id)) + 1
                    : 1;
                preset.id = newId;
                localStorage.setItem("presets", JSON.stringify([...presets, preset]));
                return Promise.resolve(newId);
            },
            updatePreset(preset: ITablePreset): Promise<void> {
                const presets = (JSON.parse(localStorage.getItem("presets")) ?? []) as ITablePreset[];
                presets.splice(presets.findIndex(p => p.id === preset.id), 1, preset);
                localStorage.setItem("presets", JSON.stringify(presets));
                return Promise.resolve();
            },
            deletePreset(preset: ITablePreset): Promise<void> {
                const presets = (JSON.parse(localStorage.getItem("presets")) ?? []) as ITablePreset[];
                presets.splice(presets.findIndex(p => p.id === preset.id), 1);
                localStorage.setItem("presets", JSON.stringify(presets));
                return Promise.resolve();
            },
        },
    };
}

export type TApi = ReturnType<typeof getApi>;
export const svc: Partial<CommonContexts<TApi, UuiContexts>> = {};