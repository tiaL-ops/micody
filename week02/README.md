## Micody & Dance!

Create your own dance move with code! Each contributor adds a JavaScript function that animates a 3D character. All moves play in sequence to create a collaborative dance performance.

### How it works

This project is a collaborative dance sequence where each contributor creates their own movement function using Three.js. The character performs each move for up to 3 seconds, creating a unique dance routine.

### How to join

1. **Fork this repository**
2. **Create your move function** in `moves/yourname.js`: (for example for me it's landy.js)
   ```js
   export default function yourName(character) {
     // your move here!!! you can take landy.js as quidance.
     character.rotation.y += 0.1;
     character.position.y = Math.sin(Date.now() * 0.001) * 0.5;
   }
   ```
3. **Add your info** to `contributors.json`:
   ```json
   {
     "name": "Your Name",
     "moveFile": "yourname.js",
     "duration": 2500 //important no more than 3 seconds 
   }
   ```
4. **Submit a pull request!** 💃

### Move Guidelines

- Your function receives a `character` parameter (Three.js Group)
- Move duration should be 1-3 seconds (1000-3000ms)
- You can animate position, rotation, scale of the character
- Like always , have fun!!!!

### Example Moves

Check out the `moves/` folder for inspiration:
- **Landy**: Jump
- **Rasoa**: Spin

### Development

To run locally:
1. Clone the repository
2. Open `index.html` in your browser
3. Click "Play Sequence" to see the dance

### Controls

- **Play Sequence**: Start the dance routine
- **Pause**: Pause the current move
- **Reset**: Return to start position

### Good First Issues

- [ ] Add your move function ( SHould be less than 35 lines of codes)
- [ ] Add your info to `contributors.json`
- [ ] Create a unique dance move

If you feel creative, we don't say no to: 
- [ ] Improve the character model
- [ ] Add sound effects


### Contributing

We welcome contributions from developers of all skill levels! Let's dance!

### License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy coding and dancing!** 💃✨
