# skillicons-tooltip

Extension for syvixor/skills-icons, that has premade components for Vue 3 and React.

To setup and use:

1. import the `Icon` component from 'skillicons-tooltip'.

   Example:

   ```vue
   <template>
     <Icon skill="javascript" position="top" />
   </template>
   <script>
   import { Icon } from "skillicons-tooltip";

   export default {
     components: { Icon },
   };
   </script>
   ```

2. put name of your skill as 'skill' and 'position' where you want to put it as props.

This library gets images from the skills-icons API. We are also on npm: https://www.npmjs.com/package/skillicons-tooltip!

Available technologies: Vue, React.
