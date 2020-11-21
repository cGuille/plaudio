class KeybindsWidget extends Widget {
    initialize() {
        const bindingDataSetItems = [
            'PlayPause',
            'Prev',
            'Next',
            'SeekDelta',
        ];

        this.bindings = bindingDataSetItems
            .map(item => ({ action: item, spec: this.owner.container.dataset['keybind' + item] }))
            .filter(binding => binding.spec && binding.spec.trim())
            .map(binding => this.parse(binding))
            .reduce((acc, binding) => {
                binding.calls.forEach(call => {
                    call.action = binding.action;
                    acc.push(call);
                });

                return acc;
            }, [])
            ;

        window.addEventListener('keyup', event => {
            this.bindings
                .filter(binding => this.bindingMatches(binding, event))
                .forEach(binding => this.performActionOf(binding))
                ;
        });
    }

    bindingMatches(binding, event) {
        const match = (
            binding.keys.code === event.code &&
            binding.keys.ctrl === event.ctrlKey &&
            binding.keys.shift === event.shiftKey &&
            binding.keys.alt === event.altKey
        );

        return match;
    }

    performActionOf(binding) {
        if (binding.action === 'PlayPause') {
            this.owner.togglePlayPause();
            return;
        }

        if (binding.action === 'Prev') {
            this.owner.prev();
            return;
        }

        if (binding.action === 'Next') {
            this.owner.next();
            return;
        }

        if (binding.action === 'SeekDelta') {
            const delta = parseFloat(binding.args[0]);
            this.owner.audio.currentTime += delta;
            return;
        }

        console.error(`Unsupported action '${binding.action}`);
    }

    parse(binding) {
        const calls = binding.spec
            .trim()
            .split('|')
            .map(s => s.trim())
            .map(s => this.parseCalls(s))
            ;

        return {
            action: binding.action,
            calls: calls,
        };
    }

    parseCalls(spec) {
        const parts = spec.split(':').map(s => s.trim());

        return {
            keys: this.parseKeys(parts[0]),
            args: this.parseArgs(parts[1] || ''),
        };
    }

    parseKeys(keysString) {
        return keysString
            .split('+')
            .map(s => s.trim())
            .reduce((keys, keyword) => {
                if (this.isUpperCase(keyword[0])) {
                    keys.code = keyword;
                } else {
                    keys[keyword] = true;
                }

                return keys;
            }, { code: null, ctrl: false, shift: false, alt: false })
            ;
    }

    parseArgs(argsString) {
        return argsString.split(',').map(s => s.trim());
    }

    isUpperCase(char) {
        const isUpper = char === char.toUpperCase();
        const isLower = char === char.toLowerCase();

        if ((isUpper && isLower) || (!isUpper && !isLower)) {
            throw new Error(`Unsupported char: '${char}'`);
        }

        return isUpper;
    }
}
