export interface IResume {
    _id?: string;
    userId: string;
    originalFileName: string;
    filePath: string;
    fileSize: number;
    parsedData: IParsedResume;
    uploadedAt: Date;
    isActive: boolean;
}

export interface IParsedResume {
    rawText: string;
    skills: string[];
    technologies: string[];
    roles: string[];
    experienceYears: number;
    education: string[];
    summary?: string;
}
