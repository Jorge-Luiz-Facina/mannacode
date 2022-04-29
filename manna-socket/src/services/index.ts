import { Application } from '../declarations';
import status_challenges from './status-challenges/status-challenges.service';
import status_players from './status-players/status-players.service';
import player_start from './player-start/player-start.service';
import applicator_start_socket from './applicator-start-socket/applicator-start-socket.service';


// Don't remove this comment. It's needed to format import lines nicely.

export default function(app: Application): void {
  app.configure(status_challenges);
  app.configure(status_players);
  app.configure(player_start);
  app.configure(applicator_start_socket);
}
