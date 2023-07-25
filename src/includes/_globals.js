import upperFirst from 'lodash/upperCase'
import camelCase from 'lodash/camelCase'

export default {
    install(app) {
        const baseComponents = import.meta.glob("@/components/base/*.vue", {
            eager: true,
        });

        Object.entries(baseComponents).forEach(([path, module]) => {
            const componentName = _.upperFirst(
                _.camelCase(
                    path.split('/').pop().replace(/\.\w+$/, "")
                )
            );

            app.component(`${componentName}`, module.default);
        });

    }
}