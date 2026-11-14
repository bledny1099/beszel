import AppKit
import Foundation

final class MenuActions: NSObject {
    static let shared = MenuActions()

    private override init() { super.init() }

    @objc func openSettings(_ sender: Any?) {
        Task { @MainActor in
            WindowManager.shared.showSettings()
        }
    }

    @objc func refreshNow(_ sender: Any?) {
        Task { @MainActor in
            AppState.shared.loadSystems()
            AppState.shared.loadSystemDetails()
            AppState.shared.loadSecurityReports()
            AppState.shared.loadAlerts()
            AppState.shared.loadContainers()
        }
    }

    @objc func triggerSecurityCheck(_ sender: NSMenuItem) {
        Task { @MainActor in
            guard let systemID = sender.representedObject as? String else { return }
            AppState.shared.triggerSecurityScan(for: systemID, mode: "check")
        }
    }

    @objc func rebootSystem(_ sender: NSMenuItem) {
        Task { @MainActor in
            guard let systemID = sender.representedObject as? String,
                  let system = AppState.shared.selectedInstanceSystems.first(where: { $0.id == systemID }) else { return }

            let sysName = system.name.isEmpty ? system.id : system.name
            let isHubHost = system.id == "kgm0fv4mrdnjw4r" || sysName.lowercased().contains("private network")

            NSApp.activate(ignoringOtherApps: true)
            let confirmAlert = NSAlert()
            confirmAlert.alertStyle = .warning
            confirmAlert.messageText = "Перезагрузить «\(sysName)»?"
            var infoText = "Перед перезагрузкой server-resurrect сохранит сессии screen/tmux, Claude Code, историю команд и состояние служб, а после загрузки сервера всё автоматически восстановится словно ребута не было."
            if isHubHost {
                infoText += "\n\nВнимание: на этом сервере работает сам Beszel Hub — панель и метрики будут недоступны ~15–30 сек."
            }
            confirmAlert.informativeText = infoText

            let rebootBtn = confirmAlert.addButton(withTitle: "Перезагрузить")
            if #available(macOS 11.0, *) {
                rebootBtn.hasDestructiveAction = true
            }
            rebootBtn.keyEquivalent = ""

            let cancelBtn = confirmAlert.addButton(withTitle: "Отмена")
            cancelBtn.keyEquivalent = "\r"

            guard confirmAlert.runModal() == .alertFirstButtonReturn else { return }

            do {
                let message = try await AppState.shared.rebootSystem(for: system)
                NSApp.activate(ignoringOtherApps: true)
                let doneAlert = NSAlert()
                doneAlert.alertStyle = .informational
                doneAlert.messageText = "Перезагрузка «\(sysName)» запущена"
                doneAlert.informativeText = message
                doneAlert.addButton(withTitle: "ОК")
                doneAlert.runModal()
            } catch {
                NSApp.activate(ignoringOtherApps: true)
                let errAlert = NSAlert()
                errAlert.alertStyle = .critical
                errAlert.messageText = "Ошибка перезагрузки «\(sysName)»"
                errAlert.informativeText = error.localizedDescription
                errAlert.addButton(withTitle: "Закрыть")
                errAlert.runModal()
            }
        }
    }

    @objc func switchHub(_ sender: NSMenuItem) {
        Task { @MainActor in
            guard let instanceID = sender.representedObject as? UUID,
                  let instance = AppState.shared.instances.first(where: { $0.id == instanceID }) else { return }
            AppState.shared.selectInstance(instance)
        }
    }

    @objc func openSystemInBrowser(_ sender: NSMenuItem) {
        Task { @MainActor in
            guard let systemID = sender.representedObject as? String,
                  let instance = AppState.shared.selectedInstance else { return }

            let urlString = "\(instance.url)/system/\(systemID)"
            if let url = URL(string: urlString) {
                NSWorkspace.shared.open(url)
            }
        }
    }

    @objc func openDashboardInBrowser(_ sender: Any?) {
        Task { @MainActor in
            guard let instance = AppState.shared.selectedInstance,
                  let url = URL(string: instance.url) else { return }
            NSWorkspace.shared.open(url)
        }
    }

    @objc func systemClicked(_ sender: NSMenuItem) {
        Task { @MainActor in
            if let url = AppState.shared.selectedInstance?.url {
                NSPasteboard.general.clearContents()
                NSPasteboard.general.setString(url, forType: .string)
            }
        }
    }

    @objc func copyToClipboard(_ sender: NSMenuItem) {
        guard let text = sender.representedObject as? String else { return }
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(text, forType: .string)
    }

    @objc func quit(_ sender: Any?) {
        Task { @MainActor in
            NSApp.terminate(nil)
        }
    }
}
