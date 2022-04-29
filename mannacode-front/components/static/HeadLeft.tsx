import React from 'react'
import {
  Group as GroupIcon,
  Settings as SettingsIcon, ViewAgenda as ViewAgendaIcon,
  ViewDay as ViewDayIcon, ArrowBackIos as ArrowBackIosIcon,
  TableChart as TableChartIcon, Dns as DnsIcon, GridOn as GridOnIcon
} from '@material-ui/icons';
import { PathName } from './Route';
export interface HeadOLeft {
  name: string;
  link: string;
  linkParams: any;
  icon: any;
}
const homeList: HeadOLeft[] = [
  { name: 'Atividades', link: `${PathName.activities}`, linkParams: null, icon: <DnsIcon /> },
  { name: 'Resultados (M)', link: `${PathName.results}`, linkParams: null, icon: <TableChartIcon /> },
  { name: 'Turmas', link: `${PathName.class}`, linkParams: null, icon: <GridOnIcon /> },];

const activities: HeadOLeft[] = [
  { name: 'Geral', link: `${PathName.activities}${PathName.general}`, linkParams: ['groupChallengeId', 'mode'], icon: <ViewAgendaIcon /> },
  { name: 'Desafios', link: `${PathName.activities}${PathName.challenges}`, linkParams: ['groupChallengeId', 'mode'], icon: <ViewDayIcon /> },
  { name: 'Configurações', link: `${PathName.activities}${PathName.settings}`, linkParams: ['groupChallengeId', 'mode'], icon: <SettingsIcon /> },
  { name: 'Atividades', link: `${PathName.activities}`, linkParams: null, icon: <ArrowBackIosIcon /> }];

const challenges: HeadOLeft[] = [
  { name: 'Jogadores', link: `${PathName.results}${PathName.players}`, linkParams: ['groupChallengeId'], icon: <GroupIcon /> },
  { name: 'Resultados (M)', link: `${PathName.results}`, linkParams: null, icon: <ArrowBackIosIcon /> },];

const challenge: HeadOLeft[] = [
  { name: 'Desafios', link: `${PathName.results}${PathName.players}${PathName.challenges}`, linkParams: ['groupChallengeId', 'playerStartId'], icon: <ViewDayIcon /> },
  { name: 'Jogadores', link: `${PathName.results}${PathName.players}`, linkParams: ['groupChallengeId'], icon: <GroupIcon /> },
  { name: 'Resultados (M)', link: `${PathName.results}`, linkParams: null, icon: <ArrowBackIosIcon /> },];

const challengesPlayer: HeadOLeft[] = [
  { name: 'Atividades', link: `${PathName.class}${PathName.player}${PathName.activities}`, linkParams: null, icon: <DnsIcon /> },
];
const challengePlayer: HeadOLeft[] = [
  { name: 'Atividades', link: `${PathName.class}${PathName.player}${PathName.activities}`, linkParams: null, icon: <DnsIcon /> },
  { name: 'Desafios', link: `${PathName.class}${PathName.player}${PathName.activities}${PathName.challenges}`, linkParams: ['groupChallengeId'], icon: <ViewDayIcon /> },
];

const headerItems = {
  '/': homeList, '/activities': homeList, '/activities/settings': activities, '/activities/challenges': activities,
  '/activities/general': activities, '/activities/challenges/challenge': activities, '/results/players/challenges': challenges,
  '/results/players/challenges/challenge': challenge, '/class/player/activities': challengesPlayer, '/class/player/activities/challenges': challengesPlayer,
  '/class/player/activities/challenges/challenge': challengePlayer, '/class/player/profile': challengesPlayer,
  '/class/player/activities/challenges/playersFinishedChallenge': challengePlayer, '/class/player/activities/classification': challengePlayer,
  '/class/player/classification' : challengesPlayer
};
export default headerItems;
