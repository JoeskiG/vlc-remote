export default interface IPlaylistItem {
    id: number;
    name: string;
    duration: number;
    uri: string;
    artist?: string;
    date?: string;
    album?: string;
    isFolder: boolean;
    art?: string;
    hasArt?: boolean;
}