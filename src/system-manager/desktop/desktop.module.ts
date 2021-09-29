import { Module } from "@nestjs/common";
import { LayerModule } from "../layer/layer.module";
import { DesktopController } from "./desktop.controller";
import { AuthModule } from "../auth/auth.module";
import { LoggerModule } from "../logger/logger.module";
import { DesktopService } from "./desktop.service";

@Module({
    imports: [LayerModule, AuthModule, LoggerModule],
    providers: [DesktopService],
    controllers: [DesktopController],
})
export class DesktopModule { }