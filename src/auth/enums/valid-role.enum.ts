// todo: Implementar enum como graphQl Enum Type

import { registerEnumType } from '@nestjs/graphql';

export enum ValidRole {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser',
}

registerEnumType(ValidRole, {
  name: 'ValidRoles',
  description:
    'Ea Lorem mollit ut ut laboris sunt ullamco irure mollit laborum nulla consectetur.',
});
